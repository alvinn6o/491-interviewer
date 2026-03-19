//Author: Brandon Christian
//Date: 2/26/2026
//Take video Blob data, perform an analysis and return the result to behavioralService.tsx

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

    const feedback_items : any = GetVideoFeedback(video);

    //TODO: get all feedback from stored behavioral sessions
    //and average
    const sessionId = formData.get("sessionId") as string;

    const storedSessions = await db.storedBehavioralSession.findMany({
        where: {
            sessionId: sessionId,
        }
    });


    console.log("SUCCESS api/uploadVideo");

    if (storedSessions.length == 0)
        return NextResponse.json(feedback_items);

    const averages = AverageFeedbackItems(feedback_items, storedSessions);
    const updatedItems = ReplaceScores(averages, feedback_items);

    //send to behavioralSerice.tsx
    return NextResponse.json(updatedItems);
}

export async function GetVideoFeedback(video: Blob) {

    //TODO: send video to facial analyis service
    const test_items = [
        { category: "Notes", content: "Example paragraph. This is where you will see a description of your interview.", score: 1 },
        { category: "Eye Contact", content: "", score: 1 },
        { category: "Confidence", content: "", score: 2 },
        { category: "Quality of Answers", content: "", score: 3 },
        { category: "Sociability", content: "", score: 4 },
        { category: "Clear Speach", content: "", score: 5 },

    ];

    return test_items;
}

function AverageFeedbackItems(items: any, storedSessions: any[]) {
    const allFeedbackItems: any[] = [];

    //add latest items
    if (items) {
        allFeedbackItems.push(items);
    }

    //add stored items
    storedSessions.forEach((session) => {
        if (session.feedback) {
            allFeedbackItems.push(session.feedback);
        }
    });

    const sums: Record<string, number> = {};
    const counts: Record<string, number> = {};

    //total "score" values of each category
    allFeedbackItems.forEach((feedbackArray) => {
        feedbackArray.forEach((item: any) => {

            //get category and score out of an item
            const { category, score } = item;

            if (category && typeof score === "number") {
                sums[category] = (sums[category] || 0) + score;
                counts[category] = (counts[category] || 0) + 1;
            }
        });
    });

    //find average scores
    const averages: Record<string, number> = {};

    Object.keys(sums).forEach((category) => {
        if (sums[category] && counts[category])
            averages[category] = sums[category] / counts[category];
    });

    return averages;
}

function ReplaceScores(newScores: Record<string, number>, old_items: any[]) {
    const new_items :any[] = [];

    old_items.forEach(
        (item) => {
            if (newScores[item.category]) {
                item.score = newScores[item.category];
                new_items.push(item);
            }
        }
    )

    return new_items;
}