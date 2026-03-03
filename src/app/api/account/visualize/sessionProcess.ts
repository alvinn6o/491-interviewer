//Author: Brandon Christian
//Date: 3/2/2026

import { GraphItemsFromSessionCount } from "./countProcess";
import type { GraphItem } from "./generalProcess";

export async function ProcessSessionsToGraphData(sessions: any) {
    //types of graphs:
    //sessions per day (by type)
    //average score in feedback categories over time
    //average score in technical sessions over time

    //handle display interval automatically based on total amount of days between first and last session

    const countGraphItems: GraphItem[] = GraphItemsFromSessionCount(sessions);

    
}

