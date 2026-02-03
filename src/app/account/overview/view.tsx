//Author: Brandon Christian
//Date: 2/2/2026


"use client";

import type { InterviewItem } from "./interviewItem";
import { CreateTestInterviewItems } from "./interviewItem";
import { GetInterviewData } from "./overviewService";
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
            const asyncItems = await GetInterviewData("cmj58pmnj0002qp2knai2dnjx"); //TODO: use real user's ID
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
            return (<InterviewItemOverview title={title} status={status} setState={setItemState} />);
    }
}

function InterviewItemDefault({ title, status, setState }: {
    title: string;
    status: string;
    setState: React.Dispatch<React.SetStateAction<InterviewItemState>>;
}) {

    return (
        <div className="p-1">
            <span>
                <div>
                    <h3>{title}</h3>
                    <div>{status}</div>
                </div>
                <div>
                    <button onClick={() => setState(InterviewItemState.OVERVIEW) }>Overview</button>
                </div>
            </span>
        </div>
    );
}

function InterviewItemOverview({ title, status, setState }: {
    title: string;
    status: string;
    setState: React.Dispatch<React.SetStateAction<InterviewItemState>>;
}) {
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
            </span>
        </div>
    );
}