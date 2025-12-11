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

