//Author: Brandon Christian
//Date: 12/12/2025


"use client";
import { useState } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";


//-------------------------------------
//  Functionality
//-------------------------------------

async function OnUploadResumeClicked(): Promise<string>  {

    //TODO:
    //Open file selection dialogue
    //Send file to Server

    //return stub promise
    return new Promise((resolve) => {
        setTimeout(() => resolve("Upload complete!"), 10);
    });
};

function OnFailedUpload() {
    console.log("Faled Upload");
}

enum FeedbackCategory {
    NONE = "none",
    ATS_SCORE = "ats_score",
    SKILLS_MATCH = "skills_match",
    FORMATTING = "formatting",
    RECRUITER_TIPS = "recruiter_tips",
    KEYWORDS = "keywords"
}

type FeedbackItem = {
    key: FeedbackCategory
    name: string;
    description: string;
    status: boolean;
};

async function OnAddJobDescriptionClicked(job_desc: string): Promise<FeedbackItem[]> {

    //TODO:
    //Send job_desc to server
    //Use resume and job_desc to get feedback as array of FeedbackItem
    //return FeedbackItems[] to view

    //IMPORTANT:
    //data is expected to be returned as an array of objects of type FeedbackItem
    //separate the data using the key property of FeedbackItem

    //test data in place of actual response
    const test_items = [
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



//-------------------------------------
//  View
//-------------------------------------

export default function ResumeUpload() {

    return (

        <main className={styles.centered_column}>
            <h1>Resume Scanning</h1>
            <p className="description">Upload your resume and get a real ATS score that
                reflects what the big companies are using.</p>
            <Instructions />
            <ViewSwitcher />
            <br />
        </main>


    )
}


enum UploadPageState {
    UPLOAD,
    ADD_JOB_DESC,
    FEEDBACK    
}

function ViewSwitcher() {

    const [uploadState, setUploadState] = useState(UploadPageState.UPLOAD);

    //Helps set useState typing
    const test_items = [
        { key: FeedbackCategory.NONE, name: "Item 1", description: "Lorem Ipsum 1", status: true }
    ];

    const [feedbackData, setFeedbackData] = useState(test_items);

   
    switch (uploadState) {
        case UploadPageState.UPLOAD:
            return (<UploadBox changeState={setUploadState} />);

        case UploadPageState.ADD_JOB_DESC:
            return (<AddJobDescriptionBox changeState={setUploadState} changeFeedbackData={setFeedbackData} />);

        case UploadPageState.FEEDBACK:
            return (<ViewFeedbackBox changeState={setUploadState} data={feedbackData} />);
    }
}

function Instructions() {

    const NumberCircle = ({ number, description }: { number: string; description: string}) => {
        return (
            <div className={styles.centered_column}>
                <div>{number}</div>
                <p className="sub-description">{description}</p>
            </div>
        );
    }

    return (
        <div className={styles.centered_row} >
            <NumberCircle number="1" description="Upload Resume" />
            <img src="/favicon.ico" alt="icon" />
            <NumberCircle number="2" description="Add Job Description" />
            <img src="/favicon.ico" alt="icon" />
            <NumberCircle number="3" description="Get Feedback" />
        </div>
    )
}

function UploadBox({ changeState }: { changeState: React.Dispatch<React.SetStateAction<UploadPageState>> })  {

    const UploadResumeButton = async () => {
        try {
            //Try and Wait For Upload
            const result = await OnUploadResumeClicked(); 
            console.log(result);

            //Change state if successful
            changeState(UploadPageState.ADD_JOB_DESC); 
        } catch (error) {
            OnFailedUpload();
        }
    };

    return (
        <div style={{ width: '50%' }} className={`${styles.centered_column} rounded outline-2`}>
            <br />
            <h2>Upload Your Resume</h2>
            <img src="/favicon.ico" alt="icon" width = "100"/>
            <button className="orange_button" onClick={UploadResumeButton}>Upload Resume</button>
            <p className="sub-description">.pdf or .docx file</p>
        </div>
    )
}

enum JobDescriptionTemplate
{
    NONE = "",
    SOFTWARE_ENGINEER = "My awesome software engineer description",
    DATA_SCIENTIST = "My awesome data scientist description"
}

function AddJobDescriptionBox(
    { changeState, changeFeedbackData } :
        {
            changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
            changeFeedbackData: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
        }
) {

    const AddJobDescButton = async () => {
        try {
            //Wait For Upload
            const result = await OnAddJobDescriptionClicked(template);

            //Change state if successful
            changeState(UploadPageState.FEEDBACK);
            changeFeedbackData(result);
        } catch (error) {
            OnFailedUpload();
        }
    };

    const [template, setTemplate] = useState("");

    return (
        <div style={{ width: '50%' }} className={`${styles.centered_column} rounded outline-2`}>
            <br/>
            <h2>Add Job Description</h2>
            <textarea
                style={{ width: '90%', height: '150px' }}
                className="outline-1"
                placeholder="Enter job description..."
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
            />
            <span className={styles.centered_row}>
                <span>
                    <label htmlFor="templates">Templates: </label>
                    <select name="Templates" id="templates" className="outline-1" onChange={(e) => setTemplate(e.target.value) }>
                        <option value={JobDescriptionTemplate.NONE}>None</option>
                        <option value={JobDescriptionTemplate.SOFTWARE_ENGINEER}>Software Engineer</option>
                        <option value={JobDescriptionTemplate.DATA_SCIENTIST}>Data Scientist</option>
                    </select>
                </span>
                <button type="submit" onClick={AddJobDescButton} className="orange_button">Add Job Description</button>
            </span>
            <br/>
        </div>

    );
}

function ViewFeedbackBox({ changeState, data } : {
    changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
    data: FeedbackItem[];
}) {

    const ViewFeedbackBoxButton = () => {
        changeState(UploadPageState.UPLOAD);
    };

    const VFTitle = ({ title, importance }: { title: string; importance: string; }) => {

        return (
            <div className = "flex flex-row p-2">
                <h3 className="p-2" >{title}</h3>
                <span className = "flex items-center">
                    <div className="px-2 bg-orange-500 rounded-lg text-white h-1/2"> {importance} Importance</div>
                </span>
            </div>
        );
    };

    const CheckList = ({ items, type }: { items: FeedbackItem[]; type: FeedbackCategory }) => {

        const filteredItems = items.filter(item => item.key === type);

        return (
            <div className="grid grid-cols-[2fr_1fr_10fr] gap-4 p-5">
                {filteredItems.map((item, i) => (
                    <React.Fragment key={i}>
                        <div className="text-center">{item.name}</div>
                        <div className="text-center">{item.status ? "✅" : "❌"}</div>
                        <div className="text-left">{item.description}</div>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const FeedbackSection = ({ children }: { children: ReactNode }) => {
        const [left, right] = React.Children.toArray(children);

        return (
            <span className="flex w-full p-2 gap-2">
                <div className="flex flex-col rounded_box w-1/2">
                    {left}
                </div>
                <div className="flex flex-col rounded_box w-1/2">
                    {right}
                </div>
            </span>
        )
    };

    return (
        <div className={`${styles.centered_column} rounded_box w-3/4`}>
            <FeedbackSection>
                <MatchScore onClick={ViewFeedbackBoxButton} />
                <div>
                    <VFTitle title="ATS Score" importance="Medium" />
                    <hr className="border-t-2" />
                    <CheckList items={data} type={FeedbackCategory.ATS_SCORE} />
                </div>
            </FeedbackSection>

            <FeedbackSection>
                <div>
                    <VFTitle title="Skills Match" importance="High" />
                    <hr className="border-t-2" />
                    <CheckList items={data} type={FeedbackCategory.SKILLS_MATCH} />
                </div>
                <div>
                    <VFTitle title="Formatting" importance="High" />
                    <hr className="border-t-2" />
                    <CheckList items={data} type={FeedbackCategory.FORMATTING} />
                </div>
            </FeedbackSection>

            <FeedbackSection>
                <div>
                    <VFTitle title="Recruiter Tips" importance="High" />
                    <hr className="border-t-2" />
                    <CheckList items={data} type={FeedbackCategory.RECRUITER_TIPS} />
                </div>
                <div>
                    <VFTitle title="Keywords" importance="High" />
                    <hr className="border-t-2" />
                    <CheckList items={data} type={FeedbackCategory.KEYWORDS} />
                </div>
            </FeedbackSection>
        </div>
    );

}


function MatchScore({ onClick }: { onClick: () => void }) {
    return (
        <div className="p-2 flex flex-col justify-between h-64 items-center">
            <h3>Match Score</h3>
            <img src="/favicon.ico" alt="icon" width="100" />
            <button className="orange_button" onClick={onClick}>Upload and Rescan</button>
        </div>
    );
}

