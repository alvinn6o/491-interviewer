//Author: Brandon Christian
//Date: 2/10/2026
//resume/analyze

import { NextRequest, NextResponse } from "next/server";
import { ProcessTextToTokens } from "../../behavioral/uploadAudio/audioProcess"

export async function POST(req: NextRequest) {

    //extract the audio from the formData sent
    const formData = await req.formData();
    const resumeText = formData.get("resume");
    const jobDescText = formData.get("jobDesc");

    if (!resumeText || !jobDescText) {

        return NextResponse.json(
            { error: "missing resume text or job desc text" },
            { status: 400 }
        );
        
    }
    

    console.log("Posted job and resume to server ")
    //TODO Process text through resume analysis server

    const resumeTokensByCount = ProcessTextToTokens(resumeText.toString())

    return NextResponse.json(resumeTokensByCount);

}