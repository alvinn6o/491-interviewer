// Author: Brandon Christian
// Date: 4/6/2026

import { GetVolume } from "./analyzeVolume";
import type { AnalysisResponse } from "./analysisResponse";

export async function TestAnalyzeVolume(blob: Blob) {
    const volumeAnalysisResponse = await GetVolume(blob);

    const analysisResponse: AnalysisResponse = {
        volumeAnalysis: volumeAnalysisResponse
    }

    return analysisResponse;
}