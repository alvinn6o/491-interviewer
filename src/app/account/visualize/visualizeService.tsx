//Author: Brandon Christian
//Date: 3/2/2026

//Fetch the user interview sessions for the current user from the DB
//Process them server side then return the JSON to the client
//The processed data is organized as graph points with X as the date and Y as a numerical score
export async function GetAllInterviewData() {
    const response = await fetch(`/api/visualize`, {
        method: "GET"
    });

    const parsedData = await response.json();

    return parsedData;
}
