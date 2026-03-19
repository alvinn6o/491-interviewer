//Author: Brandon Christian
//Date: 2/26/2026
//Take video Blob data, perform an analysis and return the result to behavioralService.tsx
//Date 3/19/2026
//Combine with any stored video data

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {

    console.log("POST api/uploadVideo" );

    //extract the audio from the formData sent
    const formData = await req.formData();
    const video = formData.get("video") as Blob;

    console.log("extract video api/uploadVideo");

    if (!video || !(video instanceof Blob)) {
        console.log("FAIL api/uploadVideo");

        return NextResponse.json(
            { error: "No video file received" },
            { status: 400 }
        );
    }

    //Combine any stored videos before anaylsis
    const sessionId = formData.get("sessionId") as string;
    const fullVideo = await DownloadAndCombineVideos(video, sessionId);

    //Get analysis of video from service
    const feedback_items: any[] = await GetVideoFeedback(fullVideo);

    //send to behavioralSerice.tsx
    return NextResponse.json(feedback_items);
}

export async function GetVideoFeedback(video: Blob) {

    //TODO: send video to facial analyis service
    const test_items = [
        { category: "Eye Contact", content: "", score: 1 },
        { category: "Confidence", content: "", score: 2 },
        { category: "Quality of Answers", content: "", score: 3 },
        { category: "Sociability", content: "", score: 4 },
        { category: "Clear Speach", content: "", score: 5 },

    ];

    return test_items;
}

async function DownloadAndCombineVideos(baseVideo: Blob, sessionId: string) {

    const storedSessions = await db.storedBehavioralSession.findMany({
        where: {
            sessionId: sessionId,
        }
    });

    //TODO:
    return baseVideo;
}