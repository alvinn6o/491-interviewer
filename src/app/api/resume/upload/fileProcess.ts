//Author: Brandon Christian
//Date: 2/10/2026
import mammoth from "mammoth"; //read docx content //npm install mammoth

//determine which type of file was uploaded
export async function ProcessFileToText(file: File) {
    console.log("File type:")
    console.log(file.type.toString());

    try {
        switch (file.type) {
            case "text/plain": //txt
                return await file.text(); //.txt is simple extraction
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

async function ConvertDocxToText(file: File) {
    //start with File, so convert to array buffer > buffer whch mammoth accepts.

    const ab = await file.arrayBuffer();
    const b = Buffer.from(ab);
    const result = await mammoth.extractRawText({ buffer: b });
    return result.value;
}
