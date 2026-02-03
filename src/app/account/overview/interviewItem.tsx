//Author: Brandon Christian
//Date: 2/2/2026



export type InterviewItem = {
    id: number,
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
