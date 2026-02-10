//Author: Brandon Christian
//Date: 2/10/2026

import { NextRequest, NextResponse } from "next/server";
import { ProcessFileToText } from "./fileProcess";

export async function POST(req: NextRequest) {

    //extract the audio from the formData sent
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
        return NextResponse.json(
            { error: "No file received" },
            { status: 400 }
        );
    }

    try {
        const text = await ProcessFileToText(file);

        console.log("POSTED resume to text");
        console.log(text);

        //send to resumeService.ts
        //send back to client so that it can be sent together with the job desc
        //to be uploaded at a different end point
        return NextResponse.json({ content: text, success: true });
    }
    catch (err) {
        return NextResponse.json(
            { error: err },
            { status: 400 }
        );
    }
}