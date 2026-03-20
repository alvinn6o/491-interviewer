//Author: Brandon Christian
//Date: 3/16/2026
//update existing session to be abandoned

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "src/server/auth"
import { ClearVideoData } from "../../pause/manageVideoStorage"


export async function POST(
    request: NextRequest,
    { params }: { params: { sessionId: string } }
) {
    const { sessionId } = params;

    const session = await auth();

    console.log("interiew session id: " + sessionId)

    if (session && session.user) {
        //Update the first session whose ID matches the one we
        //created at session start for this user
        const interviewSession = await db.interviewSession.update({
            where: {
                userId: session.user.id,
                id: sessionId,
            },
            data: {
                completedAt: new Date(),
                status: "ABANDONED",
                savedData: {
                    deleteMany: {}
                }
            },
            include: {
                savedData: true
            }
        });

        //Return if successful
        if (interviewSession) {

            DeleteAllVideoData(interviewSession.savedData);

            return NextResponse.json(
                {
                    success: true,
                    session: interviewSession
                }
            );
        }
        else {
            console.log("failed to find session. id: " + sessionId)
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

function DeleteAllVideoData(storedSessions: any[]) {
    storedSessions.forEach(
        (session) => {
            if (session.videoURL)
                ClearVideoData(session.videoURL);
        }
    )
}
