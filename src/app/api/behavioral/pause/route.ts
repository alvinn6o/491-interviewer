//Author: Brandon Christian
//Date: 3/18/2026
//Save new entry including audio and video data
//and associate it with specific sessionId
//pause a behavioral session

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "src/server/auth"

export async function POST(
    req: NextRequest
) {

    //ignore all for now, need new solution
    return NextResponse.json(
        {
            success: false
        }
    );

    /*
    const session = await auth();


    if (session && session.user) {

        //extract the audio video and session id from the formData sent
        const formData = await req.formData();
        const audio = formData.get("audio") as Blob;
        const video = formData.get("video") as Blob;
        const sessionId = formData.get("sessionId") as string;

        console.log("pausing session id: " + sessionId)


        //Update the first session whose ID matches the one we
        //created at session start for this user
        const interviewSession = await db.interviewSession.update({
            where: {
                userId: session.user.id,
                id: sessionId,
            },
            data: {
                pausedAt: new Date()
            }
        });

        if (interviewSession) {
            //convert data to form storable on DB
            const audioBuffer = Buffer.from(await audio.arrayBuffer());
            const videoBuffer = Buffer.from(await video.arrayBuffer());

            const savedData = await db.storedBehavioralSession.create({
                data: {
                    audioData: audioBuffer,
                    videoData: videoBuffer,
                    session: {
                        connect: {
                            id: sessionId,
                        },
                    }
                }
            });

            //Return if successful
            if (savedData) {

                return NextResponse.json(
                    {
                        success: true
                    }
                );
            }
            else {
                console.log("failed to create stored data ")
            }
        } else {
            console.log("failed to find session of id " + sessionId)
        }

        
    }

    //Failed to update session for some reason
    return NextResponse.json(
        {
            success: false
        }
    );*/
}
    