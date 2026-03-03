//Author: Brandon Christian
//Date: 3/2/2026

enum GraphType {
    COUNT_BEHAVIORAL,
    COUNT_TECHNICAL,
    SCORE_BEHAVIORAL,
    SCORE_TECHNICAL
}

type GraphItem = {
    type: GraphType,
    name: string,
    points: GraphPoint[]
}

type GraphPoint = {
    date: number,
    value: number
}


export async function ProcessSessionsToGraphData(sessions: any) {

    //TODO: map session data by date

    //types of graphs:
    //sessions per day (by type)
    //average score in feedback categories over time
    //average score in technical sessions over time

    //handle display interval automatically based on total amount of days between first and last session

    const graphItems : GraphItem[] = []

    const gpCountBehavioral = GraphByCount(sessions, "BEHAVIORAL");
    const gpCountTechnical = GraphByCount(sessions, "TECHNICAL");

    graphItems.push(CreateGraphItem(gpCountBehavioral, "Behavioral Count", GraphType.COUNT_BEHAVIORAL));
    graphItems.push(CreateGraphItem(gpCountTechnical, "TECHNICAL Count", GraphType.COUNT_TECHNICAL));



    
}

function CreateGraphItem(graphPoints: GraphPoint[], name: string, type: GraphType) {
    const item: GraphItem = { type: type, name: name, points: graphPoints };
    return item;
}

//filter, group, and count the sessions
function GraphByCount(sessions: any, type: string) {
    const filtered = FilterByType(sessions, type);
    const grouped = GroupByRoundedDate(filtered);
    const points = GraphPointsByCount(grouped);

    return points;
}

//retrieve sessions by interview type
function FilterByType(sessions: any, type: string) {
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
function GroupByRoundedDate(sessions: any) {
    const groupedByRoundedDate: Record<number, any[]> = {};

    sessions.forEach(
        (session: any) => {

            //use only day, month, and year
            const dateRoundedToDay = RoundDateToDay(session.startedAt);

            //Add array if it doesnt exist yet
            if (!(dateRoundedToDay in groupedByRoundedDate))
                groupedByRoundedDate[dateRoundedToDay] = []

            //Add the session to the list of sessions on that day
            const sessionsOnDay = groupedByRoundedDate[dateRoundedToDay];

            if (sessionsOnDay)
                sessionsOnDay.push(session);
        }

    );

    return groupedByRoundedDate;
}

//create graph points for each day
//in this case, count the number of sessions on that dday
function GraphPointsByCount(sessionsByDate: Record<number, any[]>) {

    const graphPoints: GraphPoint[] = [];

    Object.entries(sessionsByDate).forEach(
        ([date, sessions]) => {

            const count: number = sessions.length;

            //covnvert back to number
            //as the key is given to us as a string
            const graphPoint : GraphPoint = { date: Number(date), value: count };
            graphPoints.push(graphPoint);
        }
    );

    return graphPoints;
}






