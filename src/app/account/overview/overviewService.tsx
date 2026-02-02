//Author: Brandon Christian
//Date: 2/2/2026

import { InterviewSessionsToInterviewItems } from "./interviewItem";


export async function GetInterviewData(userID: string) {
    const response = await fetch(`/api/interview/user/${userID}`, {
        method: "GET"
    });

    const sessions = await response.json();

    //Convert InterviewSessions to list of InterviewItems
    const items = InterviewSessionsToInterviewItems(sessions);

    return items;
}   

