"use client";
import { useState } from "react";
import styles from "./test.module.css";
import React from "react";
import type { ReactNode } from "react";

export default function ResumeUpload() {

    return (

        <main className={styles.centered_column}>
            <h1>Resume Scanning</h1>
            <p className="description">Upload your resume and get a real ATS score that reflects what the big companies are using.</p>
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

    switch (uploadState) {
        case UploadPageState.UPLOAD:
            return (<UploadBox changeState={setUploadState} />);

        case UploadPageState.ADD_JOB_DESC:
            return (<AddJobDescriptionBox changeState={setUploadState} />);

        case UploadPageState.FEEDBACK:
            return (<ViewFeedbackBox changeState={setUploadState} />);
    }
}

function Instructions() {

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


function NumberCircle({ number, description }: { number: string; description: string }) {
    return (
        <div className={styles.centered_column}>
            <div>{number}</div>
            <p className="sub-description">{description}</p>
        </div>
    )
}

function UploadBox({ changeState }: { changeState: React.Dispatch<React.SetStateAction<UploadPageState>> }) {

    const UploadResumeButton = () => {
        changeState(UploadPageState.ADD_JOB_DESC);
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

function AddJobDescriptionBox({ changeState }: { changeState: React.Dispatch<React.SetStateAction<UploadPageState>> }) {

    const AddJobDescButton = () => {
        changeState(UploadPageState.FEEDBACK);
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

function ViewFeedbackBox({ changeState }: { changeState: React.Dispatch<React.SetStateAction<UploadPageState>> }) {

    const ViewFeedbackBoxButton = () => {
        changeState(UploadPageState.UPLOAD);
    };

    return (
        <div className={`${styles.centered_column} rounded_box w-3/4`}>
            <FeedbackSection>
                <MatchScore onClick={ViewFeedbackBoxButton} />
                <div>
                    <h3>ATS Matching</h3>
                    <CheckList/>
                </div>
            </FeedbackSection>

            <FeedbackSection>
                <div>
                    <h3>Skills Match</h3>
                    <CheckList />
                </div>
                <div>
                    <h3>Formatting</h3>
                    <CheckList />
                </div>
            </FeedbackSection>

            <FeedbackSection>
                <div>
                    <h3>Recruiter Tips</h3>
                    <CheckList />
                </div>
                <div>
                    <h3>Keywords</h3>
                    <CheckList />
                </div>
            </FeedbackSection>
        </div>
    );

}

function FeedbackSection({ children }: { children: ReactNode }) {
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

function CheckList() {
    
    return (    
        <div className="grid grid-cols-[1fr_1fr_10fr] gap-4 p-5">
            {[...Array(5)].map((_, i) => (
                <>
                    <div key={`num-${i}`} className="text-center">{i + 1}</div>
                    <div key={`check-${i}`} className="text-center">✅</div>
                    <div key={`desc-${i}`} className="text-left">Lorum Ipsum Description!</div>
                </>
            ))}
        </div>
    );

}