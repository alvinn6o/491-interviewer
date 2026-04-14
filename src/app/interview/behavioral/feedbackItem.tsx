//Author: Brandon Christian
//Date: 12/12/2025
//Initial creation
//Date: 1/31/2026
//Separate into own file, conversion functions

export type FeedbackItem = {
    key: string,
    content: string,
    score: number
}

/*Convert analysis response into form the UI can read*/

export function AnalysisResultToFBItems(analysisJSON: string)
{
    const analysisItems: any[] = JSON.parse(analysisJSON);

    const fbItems: FeedbackItem[] = [];

    analysisItems.forEach((element) => {

        let category = element.category;
        let content = element.content;
        let score = element.score;

        console.log("Create FBItem from analysisItem: " + element);

        let fbItem: FeedbackItem = CreateFeedbackItem(category, content, score);
        fbItems.push(fbItem);

    });

    return fbItems;
}

export function CreateFeedbackItem(acategory: string, acontent: string, ascore: number)
{
    let category = acategory;

    console.log("Created FBItem with category " + category + " and content " + acontent + " and score " + ascore);

    const fbItem: FeedbackItem = { key: category, content: acontent, score: ascore };

    return fbItem   
}

export function CombineFeedback(a: FeedbackItem[], b: FeedbackItem[]) {
    a.forEach((fbItem) => {
        b.push(fbItem);
    });

    return b;
}