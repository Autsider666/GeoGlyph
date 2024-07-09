import {useSigma} from "@react-sigma/core";
import {ReactElement, useEffect, useState} from "react";
import {Grid} from "../../Bulma/Grid.tsx";
import {GridCell} from "../../Bulma/GridCell.tsx";
import {Panel} from "./Panel.tsx";

type Stats = {
    nodes: number,
    edges: number,
}

export const StatsPanel = (): ReactElement => {
    const [stats, setStats] = useState<Stats>({nodes: 0, edges: 0});
    const sigma = useSigma();
    const graph = sigma.getGraph();

    useEffect(() => {
        requestAnimationFrame(() => {
            const newStats:Stats = { nodes: 0, edges: 0 };
            graph.forEachNode((_, { hidden }) => !hidden && newStats.nodes++);
            graph.forEachEdge((_, _2, _3, _4, source, target) =>
                !source.hidden && !target.hidden && newStats.edges++
            );
            setStats(newStats);
        });
    }, [graph]);

    return <Panel title="Stats">
        <Grid width={1}>
            {Object.keys(stats).map((stat) =>
                <GridCell key={stat} classNames={{'has-text-centered': true}}>
                    <p className="heading">{stat}</p>
                    <p className="title">{stats[stat as keyof Stats]}</p>
                </GridCell>
            )}
        </Grid>
    </Panel>;
};