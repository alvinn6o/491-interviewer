"use client";
import styles from "./test.module.css"

export default function ResumeUpload() {
    return (

        <main className={styles.centered_column}>
            <h1>Resume Scanning</h1>
            <p className="description">Upload your resume and get a real ATS score that reflects what the big companies are using.</p>
            <Instructions />
            <UploadBox />
        </main>


    )
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

function UploadBox() {

    const UploadResumeButton = () => {
        alert("Upload functionality not yet implemented.");
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

