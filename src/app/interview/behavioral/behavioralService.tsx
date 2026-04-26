//Author: Brandon Christian
//Date: 1-30-2026
//Handle API or DB requests between the user and the server

//Date: 1-31-2026
//Send result to client

//Date: 2/17/2026
//GET prompt from DB

//Date: 2/19/2026
//Change api point "store" to "end"

//Alexander Tu
//Date: 04/25/26
//updated to handle object shape uploadVideo.ts

import type { FeedbackItem } from "./feedbackItem";
import { CombineFeedback } from "./feedbackItem";
import { AnalysisResultToFBItems, CreateFeedbackItem } from "./feedbackItem";

type RawVideoAnalysis = {
    summary?: {
        video?: {
            sample_fps?: number;
            sampled_frames?: number;
        };
        posture?: {
            valid_frames?: number;
            good_frames?: number;
            good_percent?: number;
        };
        eye_contact?: {
            valid_frames?: number;
            good_frames?: number;
            good_percent?: number;
        };
        facial_expression?: {
            valid_frames?: number;
            good_frames?: number;
            good_percent?: number;
        };
    };
    segments?: Array<{
        id?: string;
        category: string;
        startSec: number;
        endSec: number;
        isGood: boolean;
        scoreAvg?: number | null;
        note?: string | null;
        createdAt?: string;
    }>;
    error?: string;
};

type UploadResult = {
    feedback: FeedbackItem[];
    rawAnalysis?: RawVideoAnalysis;
};


//Wrapper function to simplify calls to behavioral service
export async function SendAudioVideoToServer(sessionId: string, audioData: Blob, videoData: Blob) {

    const audioResult = await SendToServer(sessionId, audioData, "/api/behavioral/uploadAudio", "audio");
    const videoResult = await SendToServer(sessionId, videoData, "/api/behavioral/uploadVideo", "video");


    const allFeedback = CombineFeedback(audioResult.feedback, videoResult.feedback);

    const formData = new FormData();

    formData.append(
        "feedback",
        JSON.stringify(allFeedback)
    );

    const response = await fetch(`/api/behavioral/setFeedback/${sessionId}`, {
        method: "POST",
        body: formData
    });

    return {
        allFeedback,
        rawVideoAnalysis: videoResult.rawAnalysis ?? null
    };
}

async function SendToServer(sessionId: string, data: Blob, apiURL: string, formDataKey: string): Promise<UploadResult> {
    //Attach data to form data
    //in order to send it to the api
    console.log("Send blob to " + apiURL);

    const formData = new FormData();

    formData.append(
        formDataKey,
        data
    );

    formData.append(
        "sessionId",
        sessionId
    );

    //obtain json analysis of the feedback data
    const response = await fetch(apiURL, {
        method: "POST",
        body: formData
    });

    console.log("got response from " + apiURL);

    //Convert json to FeedbackItem objects
    const responseData = await response.json();

    //new object shape from uploadVideo.ts
    if (responseData.feedback) {
        const fbItems: FeedbackItem[] = AnalysisResultToFBItems(JSON.stringify(responseData.feedback));

        console.log("convert to fbItems from  " + apiURL);

        //send to end.tsx
        return {
            feedback: fbItems,
            rawAnalysis: responseData.rawAnalysis
        };
    }

    //old plain-array fallback
    const fbItems: FeedbackItem[] = AnalysisResultToFBItems(JSON.stringify(responseData));

    console.log("convert to fbItems from  " + apiURL);

    //send to end.tsx
    return {
        feedback: fbItems
    };
}


//Get prompt from database
export async function GetPrompt() {
    try {
        console.log("getting prompt");

        const response = await fetch("/api/behavioral/prompt", {
            method: "GET"
        });

        console.log("got prompt");

        const json = response.json();

        console.log(json);

        return json;
    } catch (err) {
        return ({
            success: true,
            prompt: "TODO: fill DB with prompts."
        });
        //throw err;
    }
    
}

export async function PauseSession(sessionId: string, audioData: Blob, videoData: any) {
    const formData = new FormData();

    formData.append(
        "audio",
        audioData
    );

    formData.append(
        "video",
        videoData
    );

    formData.append(
        "sessionId",
        sessionId
    );


    const response = await fetch("/api/behavioral/pause", {
        method: "POST",
        body: formData
    })

    return response.json();
}

export async function AbandonSession(sessionId: string) {
    const response = await fetch(`/api/behavioral/abandon/${sessionId}`, {
        method: "POST"
    });

    return response.json();
}

export async function CreateSession(prompt: string) {
    console.log("Creating session POST")

    const response = await fetch("/api/behavioral/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({ prompt }),
    });

    console.log("Created session POST")

    return response.json();
}

export async function EndSession(sessionId: string) {
    const response = await fetch(`/api/behavioral/end/${sessionId}`, {
        method: "POST"
    });

    return response.json();
}

export async function FindPausedSession() {
    const response = await fetch(`/api/behavioral/resume`, {
        method: "GET"
    });

    return response.json();
}

export async function ResumeSession(sessionId: string) {
    const response = await fetch(`/api/behavioral/resume/${sessionId}`, {
        method: "POST"
    });

    return response.json();
}