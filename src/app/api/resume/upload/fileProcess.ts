//Author: Brandon Christian
//Date: 2/10/2026
import mammoth from "mammoth"; //read docx content //npm install mammoth

//pdf extraction is done client side
export async function ProcessFileToText(file: File) {
    console.log("File type:")
    console.log(file.type.toString());

    try {
        switch (file.type) {
            case "text/plain": //txt
                return await file.text();
            //case "application/pdf": //pdf
                //return await ConvertPdfToText(file);
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": //docx
                return await ConvertDocxToText(file);
            default:
                console.log("wrong type")
                throw Error("Improper file type");
        }
    } catch (err) {
        console.log("error:")
        console.error(err);
    }
   
}


/*import { PDFParse } from 'pdf-parse'; //read pdf content //npm install pdf-parse

async function ConvertPdfToText(file: File) {
    console.log("converting pdf")
    const ab = await file.arrayBuffer();
    console.log("to array buffer")

    const parser = new PDFParse({ data: ab });

    console.log("to parser")

    const result = await parser.getText();

    console.log(result.text);
    return result.text;
}*/

async function ConvertDocxToText(file: File) {
    //start with File, so convert to array buffer > buffer whch mammoth accepts.

    const ab = await file.arrayBuffer();
    const b = Buffer.from(ab);
    const result = await mammoth.extractRawText({ buffer: b });
    return result.value;
}
