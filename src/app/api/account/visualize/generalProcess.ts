//Author: Brandon Christian
//Date: 3/2/2026

//General functions used for mulitple types of processing
//as well as types used to help organize the data as its processed


export enum GraphType {
    COUNT_BEHAVIORAL,
    COUNT_TECHNICAL,
    SCORE_BEHAVIORAL,
    SCORE_TECHNICAL
}

export type GraphItem = {
    type: GraphType,
    name: string,
    points: GraphPoint[]
}

export type GraphPoint = {
    date: number,
    value: number
}

export function CreateGraphItem(graphPoints: GraphPoint[], name: string, type: GraphType) {
    const item: GraphItem = { type: type, name: name, points: graphPoints };
    return item;
}

//retrieve sessions by interview type
export function FilterByType(sessions: any, type: string) {
    const filtered: any[] = [];

    sessions.forEach(
        (session: any) => {
            if (session.type == type) {
                filtered.push(session);
            }
        }
    );

    return filtered;
}

//TODO:
function RoundDateToDay(date: number) {
    return 0;
}

//group sessions by date, rounded to day
export function GroupByRoundedDate(sessions: any) {
    const groupedByRoundedDate: Record<number, any[]> = {};

    sessions.forEach(
        (session: any) => {

            //use only day, month, and year
            const dateRoundedToDay = RoundDateToDay(session.startedAt);

            //add the session
            //add a new list to the dict if it doesnt exist yet
            (groupedByRoundedDate[dateRoundedToDay] ??= []).push(session);
        }

    );

    return groupedByRoundedDate;
}






