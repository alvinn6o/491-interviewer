//Author: Brandon Christian
//Date: 12/12/2025

//TODO: Lockout upload buttons while uploading

"use client";
import { useState } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";
import { OnUploadResumeClicked, OnAddJobDescriptionClicked } from "./uploadResume"
import type { FeedbackItem } from "./feedbackItem"
import { FeedbackCategory } from "./feedbackItem"

function OnFailedUpload() {
    //Used for failed upload of resume and job description
    console.log("Faled Upload");
}


//-------------------------------------
//  View
//-------------------------------------

export default function ResumeUpload() {

    return (

        <main className={`${styles.centered_column} pt-12`}>
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

    /*switch page state between upload resume, job desc, and feedback (results)
    also pass data between these states*/

    const [uploadState, setUploadState] = useState(UploadPageState.UPLOAD);

    //Helps set useState typing
    const test_items = [
        { key: FeedbackCategory.NONE, name: "Item 1", description: "Lorem Ipsum 1", status: true }
    ];

    const [feedbackData, setFeedbackData] = useState(test_items);

    const [resumeText, setResumeText] = useState("")

   
    switch (uploadState) {
        case UploadPageState.UPLOAD:
            return (<UploadBox changeState={setUploadState} changeResumeText={setResumeText} />);

        case UploadPageState.ADD_JOB_DESC:
            return (<AddJobDescriptionBox changeState={setUploadState} changeFeedbackData={setFeedbackData} resumeText={resumeText} />);

        case UploadPageState.FEEDBACK:
            return (<ViewFeedbackBox changeState={setUploadState} data={feedbackData} />);
    }
}

function Instructions() {

    const NumberCircle = ({ number, description }: { number: string; description: string }) => {
        return (
            <div className={`${styles.centered_column}`}>
                <div className={`${styles.circle} outline-2`}>
                    {number}
                </div>
                <p className="sub-description">{description}</p>
            </div>
        );
    }

    return (
        <div className={`${styles.centered_row} align-middle`} >
            <NumberCircle number="1" description="Upload Resume" />

            <span className={`${styles.centered_column}`}>
                <h1>→</h1> 
                <div></div> 
            </span>
            
            <NumberCircle number="2" description="Add Job Description" />
            <span className={`${styles.centered_column}`}>
                <h1>→</h1>
                <div></div>
            </span>
            <NumberCircle number="3" description="Get Feedback" />
        </div>
    )
}

function UploadBox({ changeState, changeResumeText }: {
    changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
    changeResumeText: React.Dispatch<React.SetStateAction<string>>;
}) {

    const [isEmpty, setEmpty] = useState(false);
    const [isValid, setValid] = useState(true);
    const [isLoading, setLoading] = useState(false);

    const UploadResumeButton = async () => {
        try {
            //Try and Wait For Upload
            setLoading(true);

            const result = await OnUploadResumeClicked();

            setLoading(false);

            //catch error
            if (typeof result !== 'string') {
                setValid(false);
                return;
            }

            //Disallow empty
            if (result == "") {
                setEmpty(true);
                return;
            }

            console.log(result);
            changeResumeText(result);

            //Change state if successful
            changeState(UploadPageState.ADD_JOB_DESC); 
        } catch (error: any) {
            console.log(error);
            OnFailedUpload();
        }
    };

    return (
        <div style={{ width: '50%' }} className={`${styles.centered_column} rounded outline-2`}>
            <br />
            <h2>Upload Your Resume</h2>
            <h1>↑</h1>

            {isLoading && (
                <div>
                Uploading...
                </div>
            )}

            {!isLoading && (
                <div className={`${styles.centered_column}`}>
                    <button className="orange_button" onClick={UploadResumeButton}>Upload Resume</button>
                    <p className="sub-description"> .txt, or .docx file</p>

                    {isEmpty && (
                        <div>
                            Resume was empty. Please upload a document with text.
                        </div>)}

                    {!isValid && (
                        <div>
                            Invalid file or file type. Please try again.
                        </div>)}
                </div>

            )}

            
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
    { changeState, changeFeedbackData, resumeText } :
        {
            changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
            changeFeedbackData: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
            resumeText: string
        }
) {

    const [isEmpty, setEmpty] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const AddJobDescButton = async () => {
        try {
            //Disallow empty
            if (template == "") {
                setEmpty(true);
                return;
            }

            setLoading(true);

            //Wait For Upload
            const result = await OnAddJobDescriptionClicked(resumeText, template);

            setLoading(false);

            //Change state if successful
            changeState(UploadPageState.FEEDBACK);
            changeFeedbackData(result);
        } catch (error: any) {
            console.log(error);
            OnFailedUpload();
        }
    };

    const [template, setTemplate] = useState("");

    return (
        <div style={{ width: '50%' }} className={`${styles.centered_column} rounded outline-2`}>
            <br />
            <h2>Add Job Description</h2>
            {isLoading && (
                <div>
                    Uploading...
                </div>
            )}

            {!isLoading && (
                <div className={`${styles.centered_column}`}>
                    <textarea
                        style={{ width: '90%', height: '150px' }}
                        className="outline-1"
                        placeholder="Enter job description..."
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                    />
                    <span className={styles.centered_row}>
                        <div>
                            <label htmlFor="templates">Templates: </label>
                            <select name="Templates" id="templates" className="outline-1" onChange={(e) => setTemplate(e.target.value)}>
                                <option value={JobDescriptionTemplate.NONE}>None</option>
                                <option value={JobDescriptionTemplate.SOFTWARE_ENGINEER}>Software Engineer</option>
                                <option value={JobDescriptionTemplate.DATA_SCIENTIST}>Data Scientist</option>
                            </select>
                        </div>
                        <button type="submit" onClick={AddJobDescButton} className="orange_button">Add Job Description</button>

                       

                    </span>
                    {isEmpty && (
                        <div>
                            Job description is empty. Please enter a description or choose a template.
                        </div>
                    )}
                </div>
            ) }
           
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
                <MatchScore onClick={ViewFeedbackBoxButton} items={data} />
                <div>
                    <VFTitle title="ATS Score" importance="Medium"/>
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


function MatchScore({ onClick, items }: { items: FeedbackItem[]; onClick: () => void }) {

    const filteredItems = items.filter(item => item.key === FeedbackCategory.MATCH_SCORE);

    const score = filteredItems[0]?.description

    return (
        <div className="p-2 flex flex-col justify-between h-64 items-center">
            <h2>Match Score</h2>

            <h1>{score}</h1>
            <button className="orange_button" onClick={onClick}>Upload and Rescan</button>
        </div>
    );
}

