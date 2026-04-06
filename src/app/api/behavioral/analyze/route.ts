//Author: Brandon Christian
//Date: 4/6/2026 
//Send audio blob to analysis service

import { NextRequest, NextResponse } from "next/server";
import { TestAnalyzeVolume } from "./analyze";


export async function POST(
    request: NextRequest
) {
    const formData = await request.formData();
    const audioBlob = formData.get("audio") as Blob;

    TestAnalyzeVolume(audioBlob);
    
    return NextResponse.json(
        {
            success: true
        }
    );
}
