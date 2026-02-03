//Author: Brandon Christian
//Date: 2/2/2026
//Initial Creation

//Date: 2/3/2026
//Change to non-dynamic route and remove userID param

import { InterviewSessionsToInterviewItems } from "./interviewItem";


export async function GetCurrentUserInterviewData() {
    const response = await fetch(`/api/interview/user`, {
        method: "GET"
    });

    const sessions = await response.json();

    //Convert InterviewSessions to list of InterviewItems
    const items = InterviewSessionsToInterviewItems(sessions);

    return items;
}   

