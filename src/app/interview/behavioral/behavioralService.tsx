//Author: Brandon Christian
//Date: 1-30-2026
//Handle API or DB requests between the user and the server
//Date: 1-31-2026
//Send result to client 

import type { FeedbackItem } from "./feedbackItem";
import { AnalysisResultToFBItems } from "./feedbackItem";

//TODO: for some reason this gets called twice in a row before finally resolving.
//Could do with re-renders triggering it twice?
//The empty array of useEffect should mean it never gets called twice, but it does.
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