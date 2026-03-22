import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

// create a new interview session
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    const { question1Id, question2Id } = await req.json();

    if (!question1Id || !question2Id) {
      return NextResponse.json({ error: "Two question IDs are required" });
    }

    const interviewSession = await db.interviewSession.create({
      data: {
        userId: session.user.id,
        type: "TECHNICAL",
        question1Id,
        question2Id,
        startedAt: new Date(),
      },
      select: {
        id: true,
        startedAt: true,
        question1Id: true,
        question2Id: true,
      },
    });

    return NextResponse.json(interviewSession);
  } catch (err) {
    console.error("SESSION CREATE ERROR:", err);
    return NextResponse.json({ error: "Failed to create session" });
  }
}