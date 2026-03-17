//Author: Brandon Christian
//Date: 3/17/2026
//Find an in-progress session and return it

import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "src/server/auth"

export async function GET(
    request: Request
) {
    return GetCurrentUserSessions();
}

export async function GetCurrentUserSessions() {
    const session = await auth();

    if (session && session.user) {
        const id = session.user.id;

        const inprogressSession = await db.interviewSession.findFirst({
            where: {
                userId: id,
                status: "IN_PROGRESS",
                type: "BEHAVIORAL"
            },
            include: {
                responses: true,
            }
        });

        if (!inprogressSession) {
            return NextResponse.json(
                {
                    success: false,
                    session: null
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                session: inprogressSession
            }
        );
    }

    return NextResponse.json(
        {
            success: false,
            session: null
        }
    );
}