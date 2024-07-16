import {SigmaContainer, useLoadGraph} from "@react-sigma/core";
import {CSSProperties, ReactElement, useEffect, useMemo} from "react";
import {Settings} from "sigma/settings";
import {GraphGridBuilder} from "../../../Graph/Graphology/Builder/GraphGridBuilder.ts";
import {drawHover, drawLabel} from "./drawUtils.ts";
import "@react-sigma/core/lib/react-sigma.min.css";

const sigmaStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'transparent',
};

type SigmaGraphProps = {
    children: ReactElement,
}

const LoadGraph = (): null => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        // const graph = new Graph();
        // graph.addNode("first", {x: 0, y: 0, size: 15, label: "My first node", color: "#FA4F40"});
        // loadGraph(graph);
        loadGraph(GraphGridBuilder.generateGrid(
            5,
            5,
            {color: "#FA4F40", size: 15},
            {},
        ));
    }, [loadGraph]);

    return null;
};

export const SigmaGraph = (props: SigmaGraphProps): ReactElement => {
    const sigmaSettings: Partial<Settings> = useMemo(
        () => ({
            defaultDrawNodeHover: drawHover,
            defaultDrawNodeLabel: drawLabel,
            // defaultDrawNodeLabel: drawLabel,
            // defaultDrawNodeHover: drawHover,
            // defaultNodeType: "image",
            // defaultEdgeType: "arrow",
            // labelDensity: 0.07,
            // labelGridCellSize: 60,
            // labelRenderedSizeThreshold: 15,
            // labelFont: "Lato, sans-serif",
            // labelColor: {
            //     color: 'white',
            // },
            // zIndex: true,
        }),
        [],
    );


    return <SigmaContainer style={sigmaStyle} settings={sigmaSettings}>
        <LoadGraph/>
        {props.children}
    </SigmaContainer>;
};