//Author: Brandon Christian
//Date: 2/2/2026

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET(
    request: Request,
    { params }: { params: { userID: string } }
) {
    const { userID } = params;

    //TODO get all InterviewSession that match userID
    const sessions = await db.interviewSession.findMany({
        where: {
            userId: userID,
        },
    });

    return NextResponse.json(sessions);
}