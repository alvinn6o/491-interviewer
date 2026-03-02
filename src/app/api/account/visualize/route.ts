import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

import { ProcessSessionsToGraphData } from "./sessionProcess"

export async function GET() {
    const sessionsResponse = await fetch(`/api/interview/session/currentuser`, {
        method: "GET"
    });

    const processedData = ProcessSessionsToGraphData(sessionsResponse.json());

    return NextResponse.json(processedData);
}

