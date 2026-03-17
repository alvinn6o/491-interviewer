//Author: Brandon Christian
//Date: 2/26/2026
//Take video Blob data, perform an analysis and return the result to behavioralService.tsx

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    console.log("POST api/uploadVideo" );

    //extract the audio from the formData sent
    const formData = await req.formData();
    const video = formData.get("video") as File;

    console.log("extract video api/uploadVideo");

    if (!video || !(video instanceof File)) {
        console.log("FAIL api/uploadVideo");

        return NextResponse.json(
            { error: "No video file received" },
            { status: 400 }
        );
    }

    //TODO: process the video data

    //TODO: test items in place of actual data
    const test_items = [
        { category: "Notes", content: "Example paragraph. This is where you will see a description of your interview.", score: 1 },
        { category: "Eye Contact", content: "", score: 1 },
        { category: "Confidence", content: "", score: 2 },
        { category: "Quality of Answers", content: "", score: 3 },
        { category: "Sociability", content: "", score: 4 },
        { category: "Clear Speach", content: "", score: 5 },

    ];

    console.log("SUCCESS api/uploadVideo");

    //send to behavioralSerice.tsx
    return NextResponse.json(test_items);
}