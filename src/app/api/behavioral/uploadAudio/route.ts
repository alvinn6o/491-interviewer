//Author: Brandon Christian
//Date: 1-30-2026
//Recieve post request from behavioralService.tsx (client) containing the recorded audio

import { NextRequest, NextResponse } from "next/server";
import { ProcessAudio } from "./audioProcess";

export async function POST(req: NextRequest) {

    //extract the audio from the formData sent
    const formData = await req.formData();
    const audio = formData.get("audio");

    if (!audio || !(audio instanceof File)) {
        return NextResponse.json(
            { error: "No audio file received" },
            { status: 400 }
        );
    }

    //Process Audio
    const tokensByCount = ProcessAudio(audio);

    //TODO: send result back to client
}