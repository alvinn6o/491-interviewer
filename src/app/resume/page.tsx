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

interface UploadResult {
    success: true;
    fileName: string;
    extractedText: string;
    textLength: number;
}

interface UploadError {
    success: false;
    error: string;
}

type UploadResponse = UploadResult | UploadError;

async function OnUploadResumeClicked(): Promise<UploadResponse> {
    try {
        const file = await WaitForFile();
        console.log("Selected file:", file);

        // Send file to server
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/resume/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!result.success) {
            return {
                success: false,
                error: result.error?.message || "Upload failed",
            };
        }

        return {
            success: true,
            fileName: result.data.fileName,
            extractedText: result.data.extractedText,
            textLength: result.data.textLength,
        };
    } catch (err) {
        console.error("Upload error:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "Upload failed",
        };
    }
}

export async function WaitForFile(): Promise<File> {
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

function OnFailedUpload() {
    //Used for failed upload of resume and job description
    console.log("Faled Upload");
}

enum FeedbackCategory {
    NONE = "none",
    ATS_SCORE = "ats_score",
    SKILLS_MATCH = "skills_match",
    FORMATTING = "formatting",
    RECRUITER_TIPS = "recruiter_tips",
    KEYWORDS = "keywords",
    MATCH_SCORE = "match_score"
}

type FeedbackItem = {
    key: FeedbackCategory
    name: string;
    description: string;
    status: boolean;
};

async function OnAddJobDescriptionClicked(
    job_desc: string,
    resumeText: string,
    resumeFileName: string
): Promise<FeedbackItem[]> {

    // Send resume text + job description to the analyze endpoint
    const response = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            resumeText,
            jobDescription: job_desc,
            resumeFileName,
        }),
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error?.message || "Analysis failed");
    }

    const { atsResult } = result.data;
    const { keywordResult, breakdown, details, score, grade } = atsResult;

    // Build FeedbackItem[] from ATS scoring results
    const items: FeedbackItem[] = [];

    // ── Match Score (overall ATS score displayed as the big number) ──
    items.push({
        key: FeedbackCategory.MATCH_SCORE,
        name: "none",
        description: `${score}% (${grade})`,
        status: true,
    });

    // ── ATS Score section: weighted breakdown per dimension ──
    items.push({
        key: FeedbackCategory.ATS_SCORE,
        name: "Overall",
        description: `ATS Score: ${score}/100 — Grade: ${grade}`,
        status: score >= 60,
    });

    for (const detail of details) {
        items.push({
            key: FeedbackCategory.ATS_SCORE,
            name: detail.dimension,
            description: `${detail.score}/100 — ${detail.explanation}`,
            status: detail.score >= 50,
        });
    }

    // ── Skills Match: technical skills + tools ──
    const technicalMatches = keywordResult.matches.filter(
        (m: { category: string }) => m.category === "technical_skill" || m.category === "tool"
    );
    for (const match of technicalMatches) {
        items.push({
            key: FeedbackCategory.SKILLS_MATCH,
            name: match.keyword,
            description: match.found
                ? `"${match.keyword}" matched`
                : `Missing: "${match.keyword}"`,
            status: match.found,
        });
    }

    // ── Keywords: all job description keywords ──
    for (const match of keywordResult.matches) {
        items.push({
            key: FeedbackCategory.KEYWORDS,
            name: match.keyword,
            description: match.found
                ? `"${match.keyword}" found in resume`
                : `"${match.keyword}" missing from resume`,
            status: match.found,
        });
    }

    // ── Recruiter Tips: actionable advice based on scores ──
    // Tip: missing keywords
    if (keywordResult.missingKeywords.length > 0) {
        const topMissing = keywordResult.missingKeywords.slice(0, 5);
        items.push({
            key: FeedbackCategory.RECRUITER_TIPS,
            name: "Add Keywords",
            description: `Consider adding: ${topMissing.join(", ")}`,
            status: false,
        });
    }

    // Tip: experience gap
    if (breakdown.experience.score < 50) {
        items.push({
            key: FeedbackCategory.RECRUITER_TIPS,
            name: "Experience",
            description: "Your experience may fall short — highlight relevant projects or internships",
            status: false,
        });
    }

    // Tip: education gap
    if (breakdown.education.score < 50) {
        items.push({
            key: FeedbackCategory.RECRUITER_TIPS,
            name: "Education",
            description: "Education requirement may not be met — emphasize certifications or coursework",
            status: false,
        });
    }

    // Tip: overall assessment
    if (score >= 75) {
        items.push({
            key: FeedbackCategory.RECRUITER_TIPS,
            name: "Strong Match",
            description: "Your resume is well-aligned with this job — likely to pass ATS screening",
            status: true,
        });
    } else if (score >= 50) {
        items.push({
            key: FeedbackCategory.RECRUITER_TIPS,
            name: "Moderate Match",
            description: "Your resume partially matches — tailor it more closely to this specific role",
            status: false,
        });
    } else {
        items.push({
            key: FeedbackCategory.RECRUITER_TIPS,
            name: "Weak Match",
            description: "Significant gaps detected — heavily tailor your resume for this role",
            status: false,
        });
    }

    return items;
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

    const [uploadState, setUploadState] = useState(UploadPageState.UPLOAD);

    //Helps set useState typing
    const test_items = [
        { key: FeedbackCategory.NONE, name: "Item 1", description: "Lorem Ipsum 1", status: true }
    ];

    const [feedbackData, setFeedbackData] = useState(test_items);

    // Store extracted resume text for later use in ATS scoring
    const [resumeText, setResumeText] = useState<string>("");
    const [resumeFileName, setResumeFileName] = useState<string>("");


    switch (uploadState) {
        case UploadPageState.UPLOAD:
            return (
                <UploadBox
                    changeState={setUploadState}
                    onResumeUploaded={(text, fileName) => {
                        setResumeText(text);
                        setResumeFileName(fileName);
                    }}
                />
            );

        case UploadPageState.ADD_JOB_DESC:
            return (
                <AddJobDescriptionBox
                    changeState={setUploadState}
                    changeFeedbackData={setFeedbackData}
                    resumeText={resumeText}
                    resumeFileName={resumeFileName}
                />
            );

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

function UploadBox({
    changeState,
    onResumeUploaded,
}: {
    changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
    onResumeUploaded: (text: string, fileName: string) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const UploadResumeButton = async () => {
        setError(null);
        setIsLoading(true);

        try {
            const result = await OnUploadResumeClicked();

            if (!result.success) {
                setError(result.error);
                return;
            }

            console.log("Upload successful:", result.fileName, `(${result.textLength} chars)`);

            // Store the extracted text and advance state
            onResumeUploaded(result.extractedText, result.fileName);
            changeState(UploadPageState.ADD_JOB_DESC);
        } catch (err) {
            setError("An unexpected error occurred");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ width: '50%' }} className={`${styles.centered_column} rounded outline-2`}>
            <br />
            <h2>Upload Your Resume</h2>
            <h1>↑</h1>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
                    {error}
                </div>
            )}
            <button
                className="orange_button"
                onClick={UploadResumeButton}
                disabled={isLoading}
            >
                {isLoading ? "Uploading..." : "Upload Resume"}
            </button>
            <p className="sub-description">.pdf, .docx, or .txt file</p>
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
    { changeState, changeFeedbackData, resumeText, resumeFileName } :
        {
            changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
            changeFeedbackData: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
            resumeText: string;
            resumeFileName: string;
        }
) {
    // Log resume info for debugging (will be used for ATS scoring in later tasks)
    console.log("Resume ready for analysis:", resumeFileName, `(${resumeText.length} chars)`);

    const AddJobDescButton = async () => {
        try {
            //Wait For Upload
            const result = await OnAddJobDescriptionClicked(template, resumeText, resumeFileName);

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

