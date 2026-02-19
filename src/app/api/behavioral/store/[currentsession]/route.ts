//Author: Brandon Christian
//Date: 2/17/2026
//update existing session with final information

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "src/server/auth"


export async function POST(
    request: NextRequest,
    { params }: { params: { currentsession: string } }
) {
    const { currentsession } = params;

    const session = await auth();

    console.log("interiew session id: " + currentsession)

    if (session && session.user) {
        //Update the first session whose ID matches the one we
        //created at session start for this user
        const interviewSession = await db.interviewSession.update({
            where: {
                userId: session.user.id,
                id: currentsession,
            },
            data: {
                completedAt: new Date(),
                status: "COMPLETED"
            }
        });

        //Return if successful
        if (interviewSession) {

            return NextResponse.json(
                {
                    success: true,
                    session: interviewSession
                }
            );
        }
        else {
            console.log("failed to find session. id: " + currentsession)
        }
        
    }

    //Failed to update session for some reason
    return NextResponse.json(
        {
            success: false,
            session: null
        }
    );
}
    