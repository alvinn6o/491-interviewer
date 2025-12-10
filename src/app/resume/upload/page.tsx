"use client";
import styles from "./test.module.css"
import { createContext, useState } from "react";

export default function ResumeUpload() {

    return (

        <main className={styles.centered_column}>
            <h1>Resume Scanning</h1>
            <p className="description">Upload your resume and get a real ATS score that reflects what the big companies are using.</p>
            <Instructions />
            <ViewSwitcher />
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
        <div style={{ outline: '2px solid black', width: '50%' }} className={`${styles.centered_column} rounded`}>
            <div></div>
            <h2>Upload Your Resume</h2>
            <div className={styles.horizontal_line}></div>
            <img src="/favicon.ico" alt="icon" width = "100"/>
            <button className="orange_button" onClick={UploadResumeButton}>Upload Resume</button>
            <p className="sub-description">.pdf or .docx file</p>
        </div>
    )
}

function AddJobDescriptionBox({ changeState }: { changeState: React.Dispatch<React.SetStateAction<UploadPageState>> }) {

    const AddJobDescButton = () => {
        changeState(UploadPageState.FEEDBACK);
    };

    return (
        <div style={{ outline: '2px solid black', width: '50%' }} className={`${styles.centered_column} rounded`}>
            <div></div>
            <h2>Add Job Description</h2>
            <div className={styles.horizontal_line}></div>
            <img src="/favicon.ico" alt="icon" width="100" />
            <button className="orange_button" onClick={AddJobDescButton}>Add Job Description</button>
            <p className="sub-description">.pdf or .docx file</p>
        </div>
    )

}

function ViewFeedbackBox({ changeState }: { changeState: React.Dispatch<React.SetStateAction<UploadPageState>> }) {

    const ViewFeedbackBoxButton = () => {
        changeState(UploadPageState.UPLOAD);
    };

    return (
        <div style={{ outline: '2px solid black', width: '50%' }} className={`${styles.centered_column} rounded`}>
            <div></div>
            <h2>View Feedback</h2>
            <div className={styles.horizontal_line}></div>
            <img src="/favicon.ico" alt="icon" width="100" />
            <button className="orange_button" onClick={ViewFeedbackBoxButton}>Close Feedback</button>
            <p className="sub-description">.pdf or .docx file</p>
        </div>
    )

}

