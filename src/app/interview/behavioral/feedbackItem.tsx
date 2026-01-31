//Author: Brandon Christian
//Date: 12/12/2025
//Initial creation
//Date: 1/31/2026
//Separate into own file, conversion functions

export enum FeedbackCategory {
    NONE = "None",
    NOTES = "Notes",
    EYE_CONTACT = "Eye Contact",
    CONFIDENCE = "Confidence",
    QUALITY_OF_ANSWERS = "Quality of Answers",
    SOCIABILITY = "Sociability",
    CLEAR_SPEECH = "Clear Speech"

}

export type FeedbackItem = {
    key: FeedbackCategory,
    content: string,
    score: number
}

export function AnalysisResultToFBItems(analysisJSON: string)
{
    const analysisItems: any[] = JSON.parse(analysisJSON);

    const fbItems: FeedbackItem[] = new Array(analysisItems.length);

    analysisItems.forEach((element) => {

        let fbItem: FeedbackItem = CreateFeedbackItem(element.category, element.content, element.score);
        fbItems.push(fbItem);

    });

    return fbItems;
}

function CreateFeedbackItem(acategory: string, acontent: string, ascore: number)
{
    let category = acategory as FeedbackCategory;

    const fbItem: FeedbackItem = { key: category, content: acontent, score: ascore };

    return fbItem   
}
