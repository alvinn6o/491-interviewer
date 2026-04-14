// Author: Brandon Christian
// Date: 4/14/2026
// Data structure to store the parts of the volumeAnalysis thats returned to the client

export type VolumeAnalysisResponse = {
    feedbackItems: any[],
    volume: number[]
}

export type AnalysisResponse = {
    volumeAnalysis: VolumeAnalysisResponse
}