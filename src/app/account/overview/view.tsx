//Author: Brandon Christian
//Date: 2/2/2026
//Initial creation

//Date 2/3/2026
//Overview display


"use client";

import type { InterviewItem, ReportItem } from "./interviewItem";
import { CreateTestInterviewItems, CreateTestReport } from "./interviewItem";
import { GetCurrentUserInterviewData, GetSessionReportData } from "./overviewService";
import { useState, useEffect } from "react";

export function PageContent() {
    //helps type useState and provides placeholder
    const testItems = CreateTestInterviewItems();

    const [items, setItems] = useState(testItems);

    
    //wrap in useEffect so that it only runs once on initial render
    //else setItems causes it to run again in a loop
    useEffect(() => {

        //wrap in async func
        //so we can call data fetch synchronously
        (async () => {
            const asyncItems = await GetCurrentUserInterviewData(); 
            setItems(asyncItems);
        })();
    }, []);


    return (
        <main>
            <InterviewList items={items} />
        </main>
    )
}

function InterviewList({ items }: { items: InterviewItem[] }) {

    if (items.length == 0) {
        return (
            <div>
                No past sessions.
            </div>
        )
    }
    //The first item in an array is at 1 apparently
    else if (items[1]?.status == "LOADING") {
        return (
            <div>
                Loading sessions.
            </div>
        ) 
    }

    return (
        <div>
            {items?.map(
                (item, i) => (
                    <div key={`${i}`}>
                        <InterviewItemBox item={item} />
                    </div>
                )
            )}
        </div>
    );
}

enum InterviewItemState {
    DEFAULT,
    OVERVIEW
}

function InterviewItemBox({ item } : { item: InterviewItem }) {

    const [itemState, setItemState] = useState(InterviewItemState.DEFAULT);

    let title = item.type.toString() == "TECHNICAL" ? "Technical Interview" : "Behavioral Interview";
    let status = item.status.toString();
    let id = item.id;

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
            return (<InterviewItemOverview title={title} status={status} setState={setItemState} sessionID={id} />);
    }
}

function InterviewItemDefault({ title, status, setState }: {
    title: string;
    status: string;
    setState: React.Dispatch<React.SetStateAction<InterviewItemState>>;
}) {

    return (
        <div className="p-1">
            <div>
                <div>
                    <h3>{title}</h3>
                    <div>{status}</div>
                </div>
                <div>
                    <button onClick={() => setState(InterviewItemState.OVERVIEW) }>Overview</button>
                </div>
            </div>
            
        </div>
    );
}

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
}