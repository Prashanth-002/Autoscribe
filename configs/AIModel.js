// aiModel.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import mime from "mime";


// Initialize Gemini client (singleton)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Helper: save binary files
function saveBinaryFile(fileName, content) {
  writeFile(fileName, content, "utf8", (err) => {
    if (err) {
      console.error(`Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`File ${fileName} saved to file system.`);
  });
}

// Generate normal text (non-stream)
export async function generateText(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Generate text + images (streaming)
export async function generateStream(prompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image-preview",
    generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
  });

  const stream = await model.generateContentStream([prompt]);

  let fileIndex = 0;

  for await (const chunk of stream) {
    if (
      !chunk.candidates ||
      !chunk.candidates[0].content ||
      !chunk.candidates[0].content.parts
    ) {
      continue;
    }

    // Case 1: If AI returned an image
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const fileName = `output_${fileIndex++}`;
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      const fileExtension = mime.getExtension(inlineData.mimeType || "");
      const buffer = Buffer.from(inlineData.data || "", "base64");
      saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
    } else {
      // Case 2: AI returned text
      console.log(chunk.text);
    }
  }
}
