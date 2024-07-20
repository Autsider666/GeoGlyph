import Graph from "graphology";
import astar from 'graphology-shortest-path/astar';
import {Queue} from "../../Queue.ts";
import {Action} from "./Action.ts";
import {AgentObject} from "./types.ts";

type Node = {
    cost: number,
    action: Action,
}

type Edge = {
    cost: number
}

export class Planner {
    plan(agent: AgentObject, availableActions: Set<Action>): Queue<Action> | undefined {
        const usableActions = new Set<Action>();

        for (const action of availableActions) {
            // reset the actions so we can start fresh with them
            action.reset();

            if (action.checkProceduralPreconditions(agent)) {
                usableActions.add(action);
            }
        }

        if (usableActions.size === 0) {
            return undefined;
        }

        const graph = new Graph<Node, Edge>({type: 'directed'});
        graph.addNode(null);

        const success = this.buildGraph();
        if (!success) {
            return undefined;
        }

        let cheapestNode: Node | undefined;
        graph.forEachNode((_, node) => {
            if (node.cost < (cheapestNode?.cost ?? Infinity)) {
                cheapestNode = node;
            }
        });

        const path = astar.bidirectional(
            graph,
            null,
            cheapestNode,
            (_, {cost}): number => cost,
            // (node, finalTarget) => euclideanDistance(points[node], points[finalTarget])
        );

        console.log(path);

        return undefined;
    }

    private buildGraph(): boolean {
        const foundOne: boolean = false;

        return foundOne;
    }
}