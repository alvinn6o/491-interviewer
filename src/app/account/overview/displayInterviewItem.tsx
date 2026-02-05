//Author: Brandon Christian
//Date: 2/2/2026
//Initial creation

//Date 2/3/2026
//Overview display

//Date 2/5/2026
//separate from list display

"use client";

import type { InterviewItem } from "./interviewItem";
import { useState } from "react";


enum InterviewItemState {
    DEFAULT,
    OVERVIEW
}

export function InterviewItemBox({ item } : { item: InterviewItem }) {

    const [itemState, setItemState] = useState(InterviewItemState.DEFAULT);

    let title = item.type.toString() == "TECHNICAL" ? "Technical Interview" : "Behavioral Interview";
    let status = item.status.toString();

    switch (status) {
        case "COMPLETED":
            status = "Completed";
            break;
        case "IN_PROGRESS":
            status = "In Progress";
            break;
        case "ABANDONED":
            status = "Abandoned";
            break;
    }

    switch (itemState) {
        case InterviewItemState.DEFAULT:
            return (<InterviewItemDefault title={title} status={status} setState={setItemState} />);
        case InterviewItemState.OVERVIEW:
            return (<InterviewItemOverview title={title} status={status} setState={setItemState} interviewItem={item} />);
    }
}

function InterviewItemWrapper({ title, status, children }: { title: string, status: string, children:React.ReactNode }) {
    return (
        <div className="border p-1 m-1">
            <div>
                <div>
                    <h3>{title}</h3>
                    <div>{status}</div>
                </div>
                <div>
                    {children}
                </div>
            </div>

        </div>
    );
}

function InterviewItemDefault({ title, status, setState }: {
    title: string;
    status: string;
    setState: React.Dispatch<React.SetStateAction<InterviewItemState>>;
}) {

    return (
        <InterviewItemWrapper title = {title} status = {status}> 
            <div>
                <button className="orange_button p-1 pl-2 pr-2" onClick={() => setState(InterviewItemState.OVERVIEW) }>Display Overview</button>
            </div>
        </InterviewItemWrapper>
    );
}

function InterviewItemOverview({ title, status, setState, interviewItem}: {
    title: string;
    status: string;
    setState: React.Dispatch<React.SetStateAction<InterviewItemState>>;
    interviewItem: InterviewItem;
}) {

    return (
        <InterviewItemWrapper title = {title} status = {status}> 
            <div>
                <button className="orange_button p-1 pl-2 pr-2" onClick={() => setState(InterviewItemState.DEFAULT)}>Close Overview</button>
            </div>
            <div className={`p-2 border rounded-md w-full`}>
                <InterviewItemInfoBox interviewItem={interviewItem} />
            </div>
        </InterviewItemWrapper>
    );

}

function InterviewItemInfoBox({ interviewItem }: { interviewItem: InterviewItem }) {
    return (
        <div>
            <div>Info: </div>
            <div className={`p-2 m-1 border rounded-md w-auto`}>
                <div>Started Date: {interviewItem.startedAt.toString()}</div>

                {interviewItem.completedAt && (
                    <div>Completed Date: {interviewItem.completedAt.toString()}</div>
                )}

                <div>Favorited: {interviewItem.isFavorite.toString()}</div>
                {interviewItem.overallScore && (
                    <div>Overall Score: {interviewItem.overallScore.toString()}</div>
                )}
            </div>

            {interviewItem.feedback && (
                <div>
                    <div>Feedback: </div>
                    <div className={`p-2 m-1 border rounded-md w-auto`}>
                        <div>{JSON.stringify(interviewItem.feedback)}</div>
                    </div>
                </div>
            )}

            {interviewItem.responses && (
                <InterviewResponsesBox responses={interviewItem.responses}/>
            )}

            
        </div>
    )
}

function InterviewResponsesBox({ responses }: { responses: any[] | null }) {
    return (<div>TODO:</div>)
}

//DEPRECATED BELOW THIS LINE
/*
function InterviewItemOverview({ title, status, setState, sessionID }: {
    title: string;
    status: string;
    setState: React.Dispatch<React.SetStateAction<InterviewItemState>>;
    sessionID: string;
}) {

    //TODO: change view when loading or errored
    const testReport: ReportItem = CreateTestReport();
    const [report, setReport] = useState(testReport);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    //wrap in useEffect so that it only runs once on initial render
    //else setReport causes it to run again in a loop
    useEffect(() => {

        //wrap in async func
        //so we can call data fetch synchronously
        (async () => {
            const asyncReport = await GetSessionReportData(sessionID);

            if (asyncReport.error)
                setError(asyncReport.error)
            else {
                setReport(asyncReport);
                setLoaded(true);
            }
            
        })();
    }, []);


    return (
        <div className="p-1">
            <span>
                <div>
                    <h3>{title}</h3>
                    <div>{status}</div>
                </div>
                <div>
                    <button onClick={() => setState(InterviewItemState.DEFAULT)}>Close Overview</button>
                </div>
                <div className={`p-2 border rounded-md w-full`}>

                    {error ? (
                        <div>{error}</div>
                    ) : loaded ? (
                        <ReportBox report={report} />
                    ) : (
                        <div>Loading Report...</div>
                    )}

                </div>
            </span>
        </div>
    );
    
}

//DEPRECATED
function ReportBox({ report }: { report: ReportItem }) {
    return (
        <div>
            <div>Info: </div>
            <div className={`p-2 m-1 border rounded-md w-auto`}>
                <div>Date: {report.createdAt.toString()}</div>
                <div>Favorited: {report.isFavorite.toString()}</div>
                <div>Score: TODO</div>
            </div>
            <div>Feedback: </div>
            <div className={`p-2 m-1 border rounded-md w-auto`}>
                <div>{report.summary}</div>
            </div>
        </div>
    )
}*/