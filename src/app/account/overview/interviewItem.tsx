//Author: Brandon Christian
//Date: 2/2/2026



export type InterviewItem = {
    id: string,
    type: string,
    status: string
}

export function CreateTestInterviewItems()
{
    const items: InterviewItem[] = new Array(1);

    items.push({ id: 0, type: "INTERVIEWS", status: "LOADING" });

    return items;
}

export function InterviewSessionsToInterviewItems(sessions: any[]) {
    const items: InterviewItem[] = new Array(sessions.length);

    sessions.forEach(
        (session) => {
            items.push(SessionToItem(session));
        }
    );

    return items;
}

function SessionToItem(session: any)
{
    const item: InterviewItem = {id: session.id, type: session.type, status: session.status };

    return item;

}

export type ReportItem = {
    summary: string,
    isFavorite: boolean,
    createdAt: any
}

export function CreateTestReport() {
    const item: ReportItem = { summary: "No report found", isFavorite: false, createdAt: Date.now() }; 
    return item;
}

export function InteriewReportToReportItem(report: any) {
    const item: ReportItem = { summary: report.summary, isFavorite: report.isFavorite, createdAt: report.createdAt };
    return item;
}