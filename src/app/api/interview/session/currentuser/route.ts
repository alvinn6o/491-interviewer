//Author: Brandon Christian
//Date: 2/2/2026
//Initial creation

//Date: 2/3/2026
//Add user ID fetch

//Date: 2/4/2026
//update route to interview/session/currentuser intead of interview/user

import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "src/server/auth"

export async function GET(
    request: Request
) {

    const session = await auth();

    if (session && session.user) {
        const id = session.user.id;

        const sessions = await db.interviewSession.findMany({
            where: {
                userId: id,
            },
            include: {
                responses: true,
            }
        });

        return NextResponse.json(sessions);
    }
   
    return NextResponse.json([]);
}