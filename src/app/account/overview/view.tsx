//Author: Brandon Christian
//Date: 2/2/2026


"use client";

import type { InterviewItem } from "./interviewItem";
import { CreateTestInterviewItems } from "./interviewItem";
import { GetInterviewData } from "./overviewService";
import { useState } from "react";

export function PageContent() {
    //helps type useState and provides placeholder
    const testItems = CreateTestInterviewItems();

    const [items, setItems] = useState(testItems);

    //wrap in async func
    //so we can call data fetch synchronously
    //TODO: use real user's ID
    (async () => {
        const asyncItems = await GetInterviewData("test");
        setItems(asyncItems);
    })();

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

function InterviewItemBox({ item }: { item: InterviewItem}) {
    return (
        <div className="p-1">
            <h3>Interview</h3>
            <div>{item.id.toString()}</div>
            <div>{item.type.toString()}</div>
            <div>{item.status.toString()}</div>
        </div>
    );
}