//Author: Brandon Christian
//Date: 2/10/2026
//Move to separate file

import { SendResumeToServer, SendResumeTextAndJobDescToServer } from "./resumeService";
import type { FeedbackItem } from "./feedbackItem"
import { FeedbackCategory } from "./feedbackItem"
import type { Dict } from "@trpc/server";


export async function OnUploadResumeClicked(): Promise<string>  { 

    try {
        /*Pause excution and wait for the user to select a non-empty
        valid file*/

        const file = await WaitForFile();
        console.log("Selected file:", file);

        //Send that file to the server
        const resp = await SendResumeToServer(file);

        //extract the text from the response
        const text = await resp.json();

        //return the text to the user
        return new Promise((resolve) => {
            setTimeout(() => resolve(text), 10);
        });

    } catch (err) {
        console.error(err);
        throw err;
    }
    
};

async function WaitForFile(): Promise<File> {

    /*Wait for file to be selected by the user*/

    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".docx,.txt";

        input.onchange = () => {
            const file = input.files?.item(0);

            if (!file) {
                console.log("no file or bad file selected")
                reject(new Error("No file selected"));
                return;
            }

            console.log("resolving with file -->")
            console.log(file.name);
            resolve(file);
        };

        input.onerror = () => reject(new Error("File selection failed"));

        input.click();
    });
}

export async function OnAddJobDescriptionClicked(resumeText: string, jobDesc: string): Promise<FeedbackItem[]> {

    //Send resume and job desc to server to be analyzed
    const response = await SendResumeTextAndJobDescToServer(resumeText, jobDesc);

    //dummy data in place of full response as full analysis
    //is not yet implemented
    const test_items = [
        { key: FeedbackCategory.MATCH_SCORE, name: "none", description: "50%", status: true },

        { key: FeedbackCategory.ATS_SCORE, name: "Item 1", description: "ATS_SCORE Lorem Ipsum 1", status: true },
        { key: FeedbackCategory.ATS_SCORE, name: "Item 2", description: "ATS_SCORE Lorem Ipsum 2", status: false },
        { key: FeedbackCategory.ATS_SCORE, name: "Item 3", description: "ATS_SCORE Lorem Ipsum 3", status: true },
        { key: FeedbackCategory.ATS_SCORE, name: "Item 4", description: "ATS_SCORE Lorem Ipsum 4", status: false },
        { key: FeedbackCategory.ATS_SCORE, name: "Item 5", description: "ATS_SCORE Lorem Ipsum 5", status: false },

        { key: FeedbackCategory.SKILLS_MATCH, name: "Item 1", description: "SKILLS_MATCH Lorem Ipsum 1", status: true },
        { key: FeedbackCategory.SKILLS_MATCH, name: "Item 2", description: "SKILLS_MATCH Lorem Ipsum 2", status: false },
        { key: FeedbackCategory.SKILLS_MATCH, name: "Item 3", description: "SKILLS_MATCH Lorem Ipsum 3", status: true },

        { key: FeedbackCategory.FORMATTING, name: "Item 1", description: "FORMATTING Lorem Ipsum 1", status: true },
        { key: FeedbackCategory.FORMATTING, name: "Item 2", description: "FORMATTING Lorem Ipsum 2", status: false },
        { key: FeedbackCategory.FORMATTING, name: "Item 3", description: "FORMATTING Lorem Ipsum 3", status: true },
        { key: FeedbackCategory.FORMATTING, name: "Item 4", description: "FORMATTING Lorem Ipsum 4", status: false },

        { key: FeedbackCategory.RECRUITER_TIPS, name: "Item 1", description: "RECRUITER_TIPS Lorem Ipsum 1", status: true },
        { key: FeedbackCategory.RECRUITER_TIPS, name: "Item 2", description: "RECRUITER_TIPS Lorem Ipsum 2", status: false },
        { key: FeedbackCategory.RECRUITER_TIPS, name: "Item 3", description: "RECRUITER_TIPS Lorem Ipsum 3", status: true }
    ];

    //For testing purposes, add the tokens to the list of keywords
    //So we can see an active change in our data in response to the
    //uploaded file
    const tokensByCount: Dict<number> = await response.json();

    console.log(tokensByCount);

    //Add each word and its count to the feedback items
    Object.entries(tokensByCount).forEach(
        ([token, value]) => {

            if (value) {
                const item: FeedbackItem = { key: FeedbackCategory.KEYWORDS, name: token, description: value.toString(), status: true };
                test_items.push(item);
            }
                
        }
    );

    //return promise containing the items
    return new Promise((resolve) => {
        setTimeout(() => resolve(test_items), 10);
    });
};

