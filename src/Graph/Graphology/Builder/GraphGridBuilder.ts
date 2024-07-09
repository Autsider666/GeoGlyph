import Graph from "graphology";

export type GridNodeData = {
    x: number,
    y: number,
    label: string,
}

export class GraphGridBuilder {
    static generateGrid<NodeData extends GridNodeData, EdgeData extends Record<string, unknown>>(
        height: number,
        width: number,
        defaultNodeData: Omit<NodeData, 'x' | 'y' |'label'>,
        defaultEdgeData: EdgeData,
        graph: Graph<NodeData, EdgeData> = new Graph<NodeData, EdgeData>(),
    ): Graph<GridNodeData> {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const key = `${x},${y}`;
                graph.addNode(key, {...defaultNodeData, x, y, label: key} as NodeData);
                if (x > 0) {
                    const otherKey = `${x - 1},${y}`;
                    graph.addEdgeWithKey(`${key} -> ${otherKey}`, key, otherKey, {...defaultEdgeData});
                }

                if (y > 0) {
                    const otherKey = `${x},${y - 1}`;
                    graph.addEdgeWithKey(`${key} -> ${otherKey}`, key, otherKey, {...defaultEdgeData});
                }
            }
        }

        return graph;
    }
}