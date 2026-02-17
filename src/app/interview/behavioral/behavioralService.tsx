//Author: Brandon Christian
//Date: 1-30-2026
//Handle API or DB requests between the user and the server
//Date: 1-31-2026
//Send result to client
//Date: 2/17/2026
//GET prompt from DB

import type { FeedbackItem } from "./feedbackItem";
import { AnalysisResultToFBItems, CreateFeedbackItem } from "./feedbackItem";


export async function SendAudioToServer(audioData: Blob) {
    //Extract the file extension
    //which differs between browsers
    const mimeType = audioData.type;
    const extension = mimeType.split("/")[1];

    const formData = new FormData();

    formData.append(
        "audio",
        audioData,
        `recording.${extension}`
    );

    //TODO: remove early end
    //saves api call costs.
    return [CreateFeedbackItem("remove line 28 in behavioralService.tsx", "interrupt before api call to save costs during testing.", 1)];

    console.log("about to send blob to back end");
    console.log("blob size: " + audioData.size);

    const response = await fetch("/api/behavioral/uploadAudio", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    const fbItems: FeedbackItem[] = AnalysisResultToFBItems(JSON.stringify(data));

    //send to page.tsx
    return fbItems;
}

//Get prompt from database
export async function GetPrompt() {

    const response = await fetch("/api/behavioral/prompt", {
        method: "GET"
    });

    console.log("got prompt");
    console.log(response.json());

    return response.json();
}

export async function SaveSession(audioData: Blob, videoData: any) {

    //TODO: get session ID and store that?
    //have to make a session as soon as we start!

    const mimeType = audioData.type;
    const extension = mimeType.split("/")[1];

    const formData = new FormData();

    formData.append(
        "audio",
        audioData,
        `recording.${extension}`
    );

    formData.append(
        "video",
        videoData
    )


    const response = await fetch("/api/behavioral/save", {
        method: "POST",
        body: formData
    })

    return response.json();
}

export async function CreateSession() {
    const response = await fetch("/api/behavioral/create", {
        method: "POST"
    });

    return response.json();
}