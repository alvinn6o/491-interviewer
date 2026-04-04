//Author: Brandon Christian
//Date: 1-30-2026
//Recieve post request from behavioralService.tsx (client) containing the recorded audio
//Date: 1-31-2026
//Send result to client 

import { NextRequest, NextResponse } from "next/server";
import { ProcessAudioToText, ProcessTextToTokens } from "./audioProcess";
import { db } from "~/server/db";

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
    let text = await ProcessAudioToText(audio);

    //gather all text transcripts of all StoredBehaioralSessions and combine with result text
    const sessionId = formData.get("sessionId") as string;

    const storedSessions = await db.storedBehavioralSession.findMany({
        where: {
            sessionId: sessionId,
        }
    });

    storedSessions.forEach(
        (storedSession) => {
            if (storedSession.transcript) {
                text = text + " " + storedSession.transcript;
            }
        }
    );

    const tokensByCount = ProcessTextToTokens(text);


    //TODO: send processed results to Behavioral Analysis

    //TODO: test items in place of actual data
    const test_items = [
        { category: "Notes", content: text, score: 0 }

    ];

    //send to behavioralSerice.tsx
    return NextResponse.json(test_items);
}