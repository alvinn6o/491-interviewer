//Author: Brandon Christian
//Date: 2/10/2026
//Move to separate file

import { SendResumeToServer, SendResumeTextAndJobDescToServer } from "./resumeService";
import type { FeedbackItem } from "./feedbackItem"
import  { FeedbackCategory  } from "./feedbackItem"


export async function OnUploadResumeClicked(): Promise<string>  { 

    try {
        const file = await WaitForFile();
        console.log("Selected file:", file);


        const resp = await SendResumeToServer(file);

    } catch (err) {
        console.error(err);
        throw err;
    }

    return new Promise((resolve) => {
        setTimeout(() => resolve("Upload complete!"), 10);//TODO: send actual resp back 
    });

    
};

async function WaitForFile(): Promise<File> {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".pdf,.docx,.txt";

        input.onchange = () => {
            const file = input.files?.item(0);

            if (!file) {
                reject(new Error("No file selected"));
                return;
            }

            resolve(file);
        };

        input.onerror = () => reject(new Error("File selection failed"));

        input.click();
    });
}

export async function OnAddJobDescriptionClicked(resumeText: string, jobDesc: string): Promise<FeedbackItem[]> {

    const response = await SendResumeTextAndJobDescToServer(resumeText, jobDesc);

    //TODO convert result to feedbackItems

    //test data in place of actual response
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
        { key: FeedbackCategory.RECRUITER_TIPS, name: "Item 3", description: "RECRUITER_TIPS Lorem Ipsum 3", status: true },

        { key: FeedbackCategory.KEYWORDS, name: "Item 1", description: "KEYWORDS Lorem Ipsum 1", status: true },
        { key: FeedbackCategory.KEYWORDS, name: "Item 2", description: "KEYWORDS Lorem Ipsum 2", status: false },
        { key: FeedbackCategory.KEYWORDS, name: "Item 3", description: "KEYWORDS Lorem Ipsum 3", status: true }
    ];

    //return stub promise
    return new Promise((resolve) => {
        setTimeout(() => resolve(test_items), 10);
    });
};

