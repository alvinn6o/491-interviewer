//Author: Brandon Christian
//Date: 2/17/2026

import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";

export async function GET() {

    return NextResponse.json(
        {
            success: true,
            prompt: "TODO: fill DB with prompts."
        }
    );

    //TODO: modify to use custom prompt
    /*
    const prompts = await db.technicalQuestion.findMany();

    const min = 0;
    const max = prompts.length;

    if (max == 0)
        return NextResponse.json(
            {
                success: false,
                prompt: "Could not fetch a prompt. 0 prompts to choose from."
            }
        );

    const id = Math.random() * (max - min) + min;

    const prompt = prompts[id];

   
    if (prompt) {
        //send to behavioralSerice.tsx
        if (prompt.question == "")
            return NextResponse.json(
                {
                    success: false,
                    prompt: "Empty prompt question from DB"
                }
            );

        return NextResponse.json(
            {
                success: true,
                prompt: prompt.question
            }
        );
    }

    return NextResponse.json(
        {
            success: false,
            prompt: "Failed to get a prompt. prompt was null."
        }
    );*/
}
    