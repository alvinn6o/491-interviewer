//Author: Brandon Christian
//Date: 2/10/2026
//resume/upload

import { NextRequest, NextResponse } from "next/server";
import { ProcessFileToText } from "./fileProcess";

export async function POST(req: NextRequest) {
    console.log("Route hit");

    //extract the audio from the formData sent
    const formData = await req.formData();
    console.log("Got formData");

    const file = formData.get("file") as File;;
    console.log("File:", file);

    if (!file) {
        console.log("No file found");
        return NextResponse.json(
            { error: "No file received for resume/upload" },
            { status: 400 }
        );
    }

    try {
        console.log("POSTED resume/uploap");

        //Process the file from a File object into raw text
        const text = await ProcessFileToText(file);

        console.log("Processed file to text");
        console.log(text);

        //send to resumeService.ts
        //send back to client so that it can be sent together with the job desc
        //to be uploaded at a different end point
        return NextResponse.json(text);
    }
    catch (err : any) {
        return NextResponse.json(
            { error: err?.message || "unknown error occurred" },
            { status: 400 }
        );
    }
}