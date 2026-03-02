//Author: Brandon Christian
//Date: 3/2/2026

//Fetch the user interview sessions for the current user from the DB
export async function GetAllInterviewData() {
    //TODO: alternate api call that processes all the data server-side before returning to the client here
    const response = await fetch(`/api/interview/session/currentuser`, {
        method: "GET"
    });

    const sessions = await response.json();

    //TODO: convert to object format? or maybe keep as json parsed

    //return items;
}
