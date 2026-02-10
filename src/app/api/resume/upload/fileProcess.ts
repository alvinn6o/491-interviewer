//Author: Brandon Christian
//Date: 2/10/2026
import * as pdfjsLib from "pdfjs-dist"; //read pdf content
import mammoth from "mammoth"; //read docx content

export async function ProcessFileToText(file: File) {
    switch (file.type) {
        case ".txt":
            return await file.text();
        case ".pdf":
            return await ConvertPdfToText(file);
        case ".docx":
            return await ConvertDocxToText(file);
        default:
            throw Error("Improper file type");
    }
}

async function ConvertPdfToText(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => ("str" in item ? item.str : "")).join(" ") + "\n";
    }

    return text;
}

async function ConvertDocxToText(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}
