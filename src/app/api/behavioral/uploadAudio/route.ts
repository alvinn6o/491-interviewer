//Author: Brandon Christian
//Date: 1-30-2026
//Recieve post request from behavioralService.tsx (client) containing the recorded audio
//Date: 1-31-2026
//Send result to client 

import { NextRequest, NextResponse } from "next/server";
import { ProcessAudioToText, ProcessTextToTokens } from "./audioProcess";

export async function POST(req: NextRequest) {

    //extract the audio from the formData sent
    const formData = await req.formData();
    const audio = formData.get("audio") as File;

    if (!audio || !(audio instanceof File)) {
        return NextResponse.json(
            { error: "No audio file received" },
            { status: 400 }
        );
    }

    //Process Audio
    //TODO: process call is hidden to save costs on API calls during testing
    //const text = await ProcessAudioToText(audio);
    //const tokensByCount = ProcessTextToTokens(text);

    //TODO: send processed results to Behavioral Analysis

    //TODO: test items in place of actual data
    const test_items = [
        { category: "Notes", content: "Analysis Unimplemented. Text transcription disabled to save API costs in uploadAudio/route.ts", score: 1 },
        { category: "Eye Contact", content: "", score: 1 },
        { category: "Confidence", content: "", score: 2 },
        { category: "Quality of Answers", content: "", score: 3 },
        { category: "Sociability", content: "", score: 4 },
        { category: "Clear Speach", content: "", score: 5 },

    ];

    //send to behavioralSerice.tsx
    return NextResponse.json(test_items);
}