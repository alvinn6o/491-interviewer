import { NextResponse } from "next/server";
import { db } from "~/server/db";

export async function POST(req: Request) {
    try {
        const { user, content } = await req.json();

        // create report
        const report = await db.user.create(
            {
                data: {

                },
                select: {
                    id: true
                }
            }
        );

        //return NextResponse.json(report, { status: 201 });

    } catch (err) {
        console.error("GENERATE FEEDBACK ERROR:", err);
        return NextResponse.json(
            { error: "Error." },
            { status: 500 }
        );
    }
}
