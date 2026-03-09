//Author: Brandon Christian
//Date: 12/12/2025

//TODO: Lockout upload buttons while uploading

"use client";
import { useState } from "react";
import styles from "./test.module.css";
import React from "react";
import { OnUploadResumeClicked, OnAddJobDescriptionClicked } from "./uploadResume"
import type { FeedbackItem } from "./feedbackItem"
import { FeedbackCategory } from "./feedbackItem"
import { JobDescriptionTemplate, JOB_DESCRIPTION_TEMPLATES, JOB_DESCRIPTION_LABELS } from "./jobDescriptionTemplates"

function OnFailedUpload() {
    //Used for failed upload of resume and job description
    console.log("Failed Upload");
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
    const [resumeFileName, setResumeFileName] = useState("")
    const [jobDescription, setJobDescription] = useState("")

    switch (uploadState) {
        case UploadPageState.UPLOAD:
            return (<UploadBox changeState={setUploadState} changeResumeText={setResumeText} changeResumeFileName={setResumeFileName} />);

        case UploadPageState.ADD_JOB_DESC:
            return (<AddJobDescriptionBox changeState={setUploadState} changeFeedbackData={setFeedbackData} resumeText={resumeText} resumeFileName={resumeFileName} changeJobDescription={setJobDescription} />);

        case UploadPageState.FEEDBACK:
            return (<ViewFeedbackBox changeState={setUploadState} data={feedbackData} jobDescription={jobDescription} resumeText={resumeText} />);
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

function UploadBox({ changeState, changeResumeText, changeResumeFileName }: {
    changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
    changeResumeText: React.Dispatch<React.SetStateAction<string>>;
    changeResumeFileName: React.Dispatch<React.SetStateAction<string>>;
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
            if (!result.success) {
                setValid(false);
                return;
            }

            //Disallow empty
            if (result.extractedText == "") {
                setEmpty(true);
                return;
            }

            console.log("Upload successful:", result.fileName, `(${result.textLength} chars)`);
            changeResumeText(result.extractedText);
            changeResumeFileName(result.fileName);

            //Change state if successful
            changeState(UploadPageState.ADD_JOB_DESC);
        } catch (error: any) {
            console.log(error);
            OnFailedUpload();
        }
    };

    return (
        <div className="w-1/2 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h2 className="text-gray-900 m-0">Upload Your Resume</h2>
            </div>

            <div className="flex flex-col items-center gap-4 px-6 py-8">
                {isLoading ? (
                    <p className="text-gray-500 text-sm">Uploading...</p>
                ) : (
                    <>
                        <div className="flex flex-col items-center gap-3 border-2 border-dashed border-gray-200 rounded-lg w-full py-8 px-4">
                            <span className="text-4xl text-gray-300">↑</span>
                            <button className="orange_button" onClick={UploadResumeButton}>Upload Resume</button>
                            <p className="text-gray-400 text-xs m-0">.pdf, .docx, or .txt</p>
                        </div>

                        {isEmpty && (
                            <p className="text-red-500 text-sm m-0">Resume was empty. Please upload a document with text.</p>
                        )}
                        {!isValid && (
                            <p className="text-red-500 text-sm m-0">Invalid file or file type. Please try again.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

function AddJobDescriptionBox(
    { changeState, changeFeedbackData, resumeText, resumeFileName, changeJobDescription } :
        {
            changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
            changeFeedbackData: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
            resumeText: string;
            resumeFileName: string;
            changeJobDescription: React.Dispatch<React.SetStateAction<string>>;
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
            const result = await OnAddJobDescriptionClicked(resumeText, template, resumeFileName);

            setLoading(false);

            //Change state if successful
            changeJobDescription(template);
            changeState(UploadPageState.FEEDBACK);
            changeFeedbackData(result);
        } catch (error: any) {
            console.log(error);
            OnFailedUpload();
        }
    };

    const [template, setTemplate] = useState("");

    return (
        <div className="w-1/2 border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <h2 className="text-gray-900 m-0">Add Job Description</h2>
            </div>

            <div className="flex flex-col gap-4 px-6 py-6">
                {isLoading ? (
                    <p className="text-gray-500 text-sm">Analyzing your resume...</p>
                ) : (
                    <>
                        <textarea
                            className="w-full h-40 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 resize-none focus:outline-none focus:border-orange-400"
                            placeholder="Paste a job description here..."
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                        />

                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <label htmlFor="templates" className="text-sm text-gray-600 whitespace-nowrap">Template:</label>
                                <select
                                    name="Templates"
                                    id="templates"
                                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400"
                                    onChange={(e) => setTemplate(JOB_DESCRIPTION_TEMPLATES[e.target.value as JobDescriptionTemplate])}
                                >
                                    {Object.values(JobDescriptionTemplate).map((key) => (
                                        <option key={key} value={key}>{JOB_DESCRIPTION_LABELS[key]}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" onClick={AddJobDescButton} className="orange_button">
                                Analyze Resume
                            </button>
                        </div>

                        {isEmpty && (
                            <p className="text-red-500 text-sm m-0">Job description is empty. Please enter a description or choose a template.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ─── Dashboard config ────────────────────────────────────────────────────────

type BadgeColor = "orange" | "blue" | "gray";

const DASHBOARD_SECTIONS: {
    key: FeedbackCategory;
    label: string;
    badge: string;
    badgeColor: BadgeColor;
    description: string;
    placeholder: string;
}[] = [
    {
        key: FeedbackCategory.ATS_SCORE,
        label: "Searchability",
        badge: "IMPORTANT",
        badgeColor: "orange",
        description: "An ATS (Applicant Tracking System) is used by most companies to filter resumes before a recruiter sees them. Fix red items to improve how well your resume is parsed.",
        placeholder: "No ATS data available.",
    },
    {
        key: FeedbackCategory.SKILLS_MATCH,
        label: "Technical Skills",
        badge: "HIGH SCORE IMPACT",
        badgeColor: "blue",
        description: "Hard skills and tools extracted from the job description. These directly impact your ATS score — match as many as possible.",
        placeholder: "No technical skills data available.",
    },
    {
        key: FeedbackCategory.BEHAVIORAL_SKILLS,
        label: "Behavioral Skills",
        badge: "MEDIUM SCORE IMPACT",
        badgeColor: "gray",
        description: "Soft skills and behavioral traits mentioned in the job description. These are secondary to technical skills but contribute to your overall match.",
        placeholder: "No behavioral skills data available.",
    },
    {
        key: FeedbackCategory.RECRUITER_TIPS,
        label: "Recruiter Tips",
        badge: "IMPORTANT",
        badgeColor: "orange",
        description: "Actionable advice to make your resume stand out to recruiters and hiring managers.",
        placeholder: "No recruiter tips available.",
    },
    {
        key: FeedbackCategory.FORMATTING,
        label: "Formatting",
        badge: "MEDIUM SCORE IMPACT",
        badgeColor: "gray",
        description: "Formatting checks ensure your resume is clean, readable, and ATS-compatible.",
        placeholder: "Formatting analysis coming soon.",
    },
];

const BADGE_STYLES: Record<BadgeColor, string> = {
    orange: "bg-orange-500 text-white",
    blue: "bg-blue-600 text-white",
    gray: "bg-zinc-600 text-zinc-300",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Segment = { text: string; color: "green" | "red" | null };

function buildHighlightedSegments(text: string, keywords: FeedbackItem[]): Segment[] {
    let segments: Segment[] = [{ text, color: null }];

    for (const kw of keywords) {
        const color = kw.status ? "green" : "red";
        const escaped = kw.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(?<![\\w])${escaped}(?![\\w])`, "gi");
        const next: Segment[] = [];

        for (const seg of segments) {
            if (seg.color !== null) { next.push(seg); continue; }

            let last = 0;
            let match: RegExpExecArray | null;
            regex.lastIndex = 0;

            while ((match = regex.exec(seg.text)) !== null) {
                if (match.index > last) next.push({ text: seg.text.slice(last, match.index), color: null });
                next.push({ text: match[0], color });
                last = regex.lastIndex;
            }
            if (last < seg.text.length) next.push({ text: seg.text.slice(last), color: null });
        }

        segments = next;
    }

    return segments;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DonutChart({ score }: { score: number }) {
    const r = 44;
    const cx = 60;
    const cy = 60;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - Math.min(score, 100) / 100);
    const color = score >= 70 ? "#22c55e" : score >= 50 ? "#f97316" : "#ef4444";

    return (
        <svg width="130" height="130" viewBox="0 0 120 120">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="12" />
            <circle
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
            <text x={cx} y={cy - 7} textAnchor="middle" fill="#111827" fontSize="20" fontWeight="bold">{score}%</text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#6b7280" fontSize="9">Match Score</text>
        </svg>
    );
}

function CategoryBar({ label, items }: { label: string; items: FeedbackItem[] }) {
    const total = items.length;
    const passing = items.filter(i => i.status).length;
    const failing = total - passing;
    const pct = total === 0 ? 100 : Math.round((passing / total) * 100);
    const barColor = pct === 100 ? "#22c55e" : pct >= 60 ? "#f97316" : "#ef4444";

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">{label}</span>
                {total === 0
                    ? <span className="text-gray-400 text-xs">—</span>
                    : failing > 0
                        ? <span className="text-red-500 text-xs">{failing} to fix</span>
                        : <span className="text-green-600 text-xs">All clear</span>
                }
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor, transition: "width 0.5s ease" }} />
            </div>
        </div>
    );
}

function ReportSection({ label, badge, badgeColor, description, items, placeholder }: {
    label: string;
    badge: string;
    badgeColor: BadgeColor;
    description: string;
    items: FeedbackItem[];
    placeholder: string;
}) {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-gray-900 m-0">{label}</h3>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold tracking-wide ${BADGE_STYLES[badgeColor]}`}>{badge}</span>
            </div>
            <p className="text-gray-500 text-sm px-5 py-3 border-b border-gray-200 m-0">{description}</p>
            {items.length === 0 ? (
                <p className="px-5 py-4 text-gray-400 text-sm italic m-0">{placeholder}</p>
            ) : (
                <div className="divide-y divide-gray-100">
                    {items.map((item, i) => (
                        <div key={i} className="grid grid-cols-[minmax(120px,1fr)_36px_3fr] gap-3 px-5 py-3 items-start">
                            <span className="text-gray-800 text-sm font-medium">{item.name}</span>
                            <span className="text-center text-base leading-none pt-0.5">{item.status ? "✅" : "❌"}</span>
                            <span className="text-gray-500 text-sm">{item.description}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

function ViewFeedbackBox({ changeState, data, jobDescription, resumeText }: {
    changeState: React.Dispatch<React.SetStateAction<UploadPageState>>;
    data: FeedbackItem[];
    jobDescription: string;
    resumeText: string;
}) {
    const [activeTab, setActiveTab] = useState<"report" | "jobdesc" | "optimizer">("report");

    const scoreStr = data.find(i => i.key === FeedbackCategory.MATCH_SCORE)?.description ?? "0%";
    const score = parseInt(scoreStr.match(/^(\d+)/)?.[1] ?? "0");

    const keywords = data.filter(i => i.key === FeedbackCategory.KEYWORDS);
    const segments = buildHighlightedSegments(jobDescription, keywords);

    const tabs: { key: "report" | "jobdesc" | "optimizer"; label: string }[] = [
        { key: "report", label: "Resume Report" },
        { key: "jobdesc", label: "Job Description" },
        { key: "optimizer", label: "AI Optimizer" },
    ];

    return (
        <div className="flex w-11/12 max-w-screen-xl rounded-lg overflow-hidden border border-gray-200 min-h-[80vh]">

            {/* ── Left Sidebar ── */}
            <aside className="w-64 flex-shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col gap-6 p-5">
                <div className="flex flex-col items-center gap-3 pt-2">
                    <DonutChart score={score} />
                    <button className="orange_button w-full text-center text-sm" onClick={() => changeState(UploadPageState.UPLOAD)}>
                        Upload &amp; Rescan
                    </button>
                </div>

                <hr className="border-gray-200" />

                <div className="flex flex-col gap-4">
                    {DASHBOARD_SECTIONS.map(sec => (
                        <CategoryBar
                            key={sec.key}
                            label={sec.label}
                            items={data.filter(i => i.key === sec.key)}
                        />
                    ))}
                </div>
            </aside>

            {/* ── Right Panel ── */}
            <div className="flex flex-col flex-1 min-w-0 bg-white">

                {/* Tab bar */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.key ? "border-b-2 border-orange-500 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {activeTab === "report" && (
                        <div className="flex flex-col gap-5">
                            {DASHBOARD_SECTIONS.map(sec => (
                                <ReportSection
                                    key={sec.key}
                                    label={sec.label}
                                    badge={sec.badge}
                                    badgeColor={sec.badgeColor}
                                    description={sec.description}
                                    items={data.filter(i => i.key === sec.key)}
                                    placeholder={sec.placeholder}
                                />
                            ))}
                        </div>
                    )}

                    {activeTab === "jobdesc" && (
                        <div className="max-w-3xl mx-auto">
                            <div className="flex gap-4 mb-5 text-sm">
                                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-green-500"></span><span className="text-gray-600">Found in resume</span></span>
                                <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-red-500"></span><span className="text-gray-600">Missing from resume</span></span>
                            </div>
                            <div className="text-gray-800 text-sm leading-7 whitespace-pre-wrap font-mono bg-gray-50 border border-gray-200 rounded-lg p-5">
                                {segments.map((seg, i) =>
                                    seg.color === "green" ? (
                                        <mark key={i} className="bg-green-100 text-green-800 rounded px-0.5">{seg.text}</mark>
                                    ) : seg.color === "red" ? (
                                        <mark key={i} className="bg-red-100 text-red-700 rounded px-0.5">{seg.text}</mark>
                                    ) : (
                                        <React.Fragment key={i}>{seg.text}</React.Fragment>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "optimizer" && (
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-center gap-3 mb-5">
                                <span className="text-xs px-2 py-0.5 rounded font-semibold tracking-wide bg-orange-500 text-white">COMING SOON</span>
                                <p className="text-gray-500 text-sm m-0">AI-powered resume optimization will be available here. Your resume is shown below for preview.</p>
                            </div>
                            <div className="text-gray-800 text-sm leading-7 whitespace-pre-wrap font-mono bg-gray-50 border border-gray-200 rounded-lg p-5">
                                {resumeText || <span className="text-gray-400 italic">No resume text available.</span>}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

