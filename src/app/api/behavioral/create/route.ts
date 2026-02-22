//Author: Brandon Christian
//Date: 2/17/2026
//Create new behavioral session on session start

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "src/server/auth"


export async function POST() {

    const prompts = await db.technicalQuestion.findMany();

    const session = await auth();

    if (session && session.user) {
        const response = await db.interviewSession.create(
            {
                data: {
                    type: "BEHAVIORAL",
                    userId: session.user.id,
                    status: "IN_PROGRESS"
                },
                select: {
                    id: true,
                }
            }
        );

        return NextResponse.json(response);
    }

}
    