import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

// Convert TipTap JSON to docx-compatible children
function parseTipTapToDocx(node) {
  if (!node) return [];

  // Handle arrays of nodes (the usual case for content)
  if (Array.isArray(node)) {
    return node.flatMap(parseTipTapToDocx);
  }

  switch (node.type) {
    case "doc":
      return parseTipTapToDocx(node.content);

    case "paragraph":
      return [
        new Paragraph({
          children: (node.content || []).map((child) =>
            new TextRun({
              text: child.text || "",
              bold: child.marks?.some((m) => m.type === "bold"),
              italics: child.marks?.some((m) => m.type === "italic"),
              underline: child.marks?.some((m) => m.type === "underline"),
            })
          ),
        }),
      ];

    case "heading":
      return [
        new Paragraph({
          heading:
            node.attrs?.level === 1
              ? "Heading1"
              : node.attrs?.level === 2
              ? "Heading2"
              : "Heading3",
          children: (node.content || []).map(
            (child) => new TextRun(child.text || "")
          ),
        }),
      ];

    case "text":
      return [
        new TextRun({
          text: node.text || "",
          bold: node.marks?.some((m) => m.type === "bold"),
          italics: node.marks?.some((m) => m.type === "italic"),
          underline: node.marks?.some((m) => m.type === "underline"),
        }),
      ];

    default:
      // fallback: recurse into children if they exist
      return node.content ? parseTipTapToDocx(node.content) : [];
  }
}


export const downloadDocx = async (contentJSON, fileName = "document.docx") => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: parseTipTapToDocx(contentJSON), // now processes doc → paragraphs → text
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, fileName.endsWith(".docx") ? fileName : `${fileName}.docx`);
};
