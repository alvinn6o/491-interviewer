//Author: Brandon Christian
//Date: 2/2/2026
//Initial creation

//Date 2/3/2026
//Overview display

//Date 2/5/2026
//separate from item display
//Deprecate report


"use client";

import type { InterviewItem } from "./interviewItem";
import { CreateTestInterviewItems } from "./interviewItem";
import { GetCurrentUserInterviewData } from "./overviewService";
import { useState, useEffect } from "react";
import { InterviewItemBox } from "./displayInterviewItem"

enum InterviewListState {
    ALL,
    FAVORITE
}

export function DisplayInterviewList() {
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

    const [state, setState] = useState(InterviewListState.ALL);

    return (
        <main>
            <button className="orange_button p-1 m-1 pl-2 pr-2" onClick={() => setState(InterviewListState.ALL) }>All</button>
            <button className="orange_button p-1 m-1 pl-2 pr-2" onClick={() => setState(InterviewListState.FAVORITE)}>Favorites</button>
            {state == InterviewListState.ALL ? (
                <InterviewList items={items} />
            )  : (
                <FavoriteInterviewList items={items} />
            )}
           
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

function FavoriteInterviewList({ items }: { items: InterviewItem[] }) {

    const [allItems, setAllItems] = useState(items);

    useEffect(() => {

        const favoriteItems: InterviewItem[] = [];

        //wrap in async func
        //so we can call data fetch synchronously
        items.forEach((item) => {

            if (item.isFavorite)
                favoriteItems.push(item);
        });

        setAllItems(favoriteItems);

    }, []);

    return (
        <InterviewList items={allItems} />
    );
}