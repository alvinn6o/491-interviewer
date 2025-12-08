"use client";
import styles from "./test.module.css"

export default function ResumeUpload() {
    return (

        <div className={styles.column} style={{ alignContent: "center" }}>
            <h1>Resume Scanning</h1>
            <p className="description">Upload your resume and get a real ATS score that reflects what the big companies are using.</p>
            <Instructions />
            <UploadBox />
        </div>


    )
}

function Instructions() {
    return (
        <div className={styles.row}>
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
        <div className={styles.column}>
            <div>{number}</div>
            <p className="description">{description}</p>
        </div>
    )
}

function UploadBox() {

    const UploadResumeButton = () => {
        alert("Upload functionality not yet implemented.");
    };

    return (
        <div style={{ outline: '5px solid red' }} className={styles.column}>
            <h1 >Upload Your Resume</h1>
            <img src="/favicon.ico" alt="icon" width = "100"/>
            <button style={{ outline: '5px solid red' }} className="orange-button" onClick={UploadResumeButton}>Upload Resume</button>
            <p className="description">.pdf or .docx file</p>
        </div>
    )
}

