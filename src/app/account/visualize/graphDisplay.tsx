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
import { useRef } from "react";
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
} from "chart.js";

import "chartjs-adapter-date-fns";

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend
);


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
        []);

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

    //Convert the GraphPoints into a form readable
    //by chart.js

    const graphXYPoints: any[] = [];

    graph.points.forEach(
        (point: GraphPoint) => {
            const xyPoint = { x: point.date, y: point.value }
            graphXYPoints.push(xyPoint);
        }
    )

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Destroy previous chart on re-render to avoid duplicates
        chartRef.current?.destroy();

        chartRef.current = new Chart(canvas, {
            type: "line",
            data: {
                datasets: [
                    {
                        label: "Values",
                        data: graphXYPoints,
                        borderColor: "blue",
                        fill: false,
                    },
                ],
            },
            options: {
                parsing: false,
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day",
                            displayFormats: { day: "MMM d" },
                        },
                    },
                    y: { beginAtZero: true },
                },
            },
        });

        return () => {
            chartRef.current?.destroy();
            chartRef.current = null;
        };
    }, [graphXYPoints]);

    return (
        <div>
            <div>Type: {graph.type}</div>
            <div> Name: {graph.name}</div>
            <canvas ref={canvasRef} />
            <div>
                {graph.points?.map(
                    (point, i) => (
                        <div key={`${i}`}>
                            <GraphPointDisplay point={point} />
                        </div>
                    )
                )}
            </div>
        </div>
    );

    /*
    return (
        
    )*/
}

function GraphPointDisplay({ point }: { point: GraphPoint }) {
    return (
        <div>
            * Date: {point.date}, Value: {point.value}
        </div>
    )
}
