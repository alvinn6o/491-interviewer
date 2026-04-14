// Author: Brandon Christian
// Date: 4/14/2026
// Data structure to store the parts of an analysisItem that will be sent to the client as feedback

export type AnalysisItem = {
    category: string,
    content?: string,
    score?: number
}

export function CreateAnalysisItemContent(category: string, content: string) {
    const item: AnalysisItem = { category: category, content: content }
    return item;
}

export function CreateAnalysisItemScore(category: string, score: number) {
    const item: AnalysisItem = { category: category, score: score }
    return item;
}