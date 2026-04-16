// Author: Brandon Christian
// Date: 4/6/2026

import { GetVolume } from "./analyzeVolume";
import type { AnalysisResponse } from "./analysisResponse";
import { GetFillerAnalysis } from "./analyzeFiller";

export async function TestAnalyzeVolume(blob: Blob, tokens: Record<string, number> ) {
    const volumeAnalysisResponse = await GetVolume(blob);
    const fillerAnalysisResponse = GetFillerAnalysis(tokens);

    const analysisResponse: AnalysisResponse = {
        volumeAnalysis: volumeAnalysisResponse,
        fillerAnalysis: fillerAnalysisResponse
    }

    return analysisResponse;
}