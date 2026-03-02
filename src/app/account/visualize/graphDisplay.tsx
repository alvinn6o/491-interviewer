//Author: Brandon Christian
//Date: 3/2/2026

type GraphItem = {
    title : string
}

export function GraphList(loading: boolean, graphs: GraphItem[]) {

    //single message if empty or loading
    if (graphs.length == 0) {

        if (loading) {
            return (
                <div>
                    Loading sessions.
                </div>
            )
        }
        else {
            return (
                <div>
                    No past sessions.
                </div>
            )
        }
        
    }

    //map each graph item to the graph display
    return (
        <div>
            {graphs?.map(
                (graph, i) => (
                    <div key={`${i}`}>
                        <GraphItemDisplay graph={graph} />
                    </div>
                )
            )}
        </div>
    );
}

function GraphItemDisplay({ graph }: { graph: GraphItem }) {
    return (
        <div>
            TODO: GraphItemDisplay()
        </div>
    )
}
