"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const ingest = action({
  args: {
    fileUrl: v.string(),  // only fileUrl
    fileId: v.string()    // and fileId
  },
  handler: async (ctx, args) => {
    console.log("Fetching PDF:", args.fileUrl);

    // 1. Fetch PDF file
    const response = await fetch(args.fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    // 2. Load PDF into docs
    const loader = new WebPDFLoader(new Blob([arrayBuffer]));
    const docs = await loader.load();

    // 3. Combine into a single string
    let pdfTextContent = "";
    docs.forEach(doc => {
      pdfTextContent += doc.pageContent;
    });

    // 4. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await splitter.createDocuments([pdfTextContent]);

    const chunks = splitDocs.map(doc => doc.pageContent);

    console.log(`Prepared ${chunks.length} chunks for embedding`);

    // 5. Embed & store
    await ConvexVectorStore.fromTexts(
      chunks,
      { fileId: args.fileId },
      new GoogleGenerativeAIEmbeddings({
        apiKey: "Use Your Key",
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    return "Embedding completed";
  },
});




export const search = action({
  args: {
    query: v.string(),
    fileId: v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyAsYdDOfJ7378o6BuKK4ixp8hngIKCvYfM",
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    // 👇 Apply metadata filter directly
    const result = await vectorStore.similaritySearch(args.query, 3, {
      fileId: args.fileId,
    });

    console.log("Search results:", result);

    return result.map(doc => ({
      pageContent: doc.pageContent,
      fileId: doc.metadata?.fileId ?? null,
      id: doc.id ?? null
    }));
  },
});
