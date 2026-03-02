//Author: Brandon Christian
//Date: 3/2/2026



export async function ProcessSessionsToGraphData(sessionsJSON: any) {

    //TODO: map session data by date

    //types of graphs:
    //sessions per day (by type)
    //average score in feedback categories over time
    //average score in technical sessions over time
    //average score in resume categories over time

    //handle display interval automatically based on total amount of days between first and last session

    const countPointsBehavioral = SessionsToGraphByTypeCount(sessionsJSON, "BEHAVIORAL");
    const countPointsTechnical = SessionsToGraphByTypeCount(sessionsJSON, "TECHNICAL");
}

//TODO: test
function SessionsToGraphByTypeCount(sessions: any, type: string) {
    const ungroupedPoints: any[]= [];

    sessions.forEach(
        (session: any) => {
            if (session.type == type) {
                const sessionPoint = { date: session.startedAt, score: 1 };
                ungroupedPoints.push(sessionPoint);
            }
        }
    );

    const pointsGroupedByDay: Record<number, number> = {};

    ungroupedPoints.forEach(
        (point: any) => {

            //use only day, month, and year
            const dateRoundedToDay = RoundDateToDay(point.date);

            pointsGroupedByDay[dateRoundedToDay] = pointsGroupedByDay + point.score;
            //test;
        }

    );

    const groupedPoints: any[] = [];

    Object.entries(pointsGroupedByDay).forEach(
        ([date, count]) => {
            const sessionPoint = { date: date, score: count };
            groupedPoints.push(sessionPoint);
        }
    );
}

//TODO:
function RoundDateToDay(date: number) {
    return 0;
}


