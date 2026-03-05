//Author: Brandon Christian
//Date: 3/2/2026

"use client";

export type GraphItem = {
    type: string,
    name: string,
    points: GraphPoint[]
}

export type GraphPoint = {
    date: number,
    value: number
}

import { useState, useEffect } from "react";
import { GetGraphDataAsync } from "./visualizeService";


export function Display() {

    const [loading, setLoading] = useState(true);
    const test_items: GraphItem[] = [];
    const [graphData, setGraphData] = useState(test_items);

    useEffect(
        () => {

            (async () => {
                GetGraphDataAsync(
                    setLoading,
                    setGraphData
                );
            })();

        },
        [] );

    return (
        <GraphList loading={loading} graphs={graphData} />
    );
}


function GraphList({ loading, graphs }: { loading: boolean, graphs: GraphItem[] }) {

    //single message if empty or loading
    if (graphs.length == 0) {

        if (loading) {
            return (
                <div>
                    Loading sessions.
                </div>
            )
        }
        else {
            return (
                <div>
                    No past sessions.
                </div>
            )
        }
        
    }

    //map each graph item to the graph display
    return (
        <div>
            {graphs?.map(
                (graph, i) => (
                    <div key={`${i}`}>
                        <GraphItemDisplay graph={graph} />
                    </div>
                )
            )}
        </div>
    );
}

function GraphItemDisplay({ graph }: { graph: GraphItem }) {
    return (
        <div>
            Type: {graph.type}
            Name: {graph.name}
            {graph.points?.map(
                (point, i) => (
                    <div key={`${i}`}>
                        <GraphPointDisplay point={point} />
                    </div>
                )
            )}
        </div>
    )
}

function GraphPointDisplay({ point }: { point: GraphPoint }) {
    return (
        <div>
            * Date: {point.date}, Value: {point.value}
        </div>
    )
}
