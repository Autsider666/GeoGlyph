import {SigmaContainer, useLoadGraph} from "@react-sigma/core";
import Graph from "graphology";
import {CSSProperties, ReactElement, useEffect} from "react";
import "@react-sigma/core/lib/react-sigma.min.css";

const sigmaStyle: CSSProperties = {height: "500px", width: "90vw", textAlign: 'left'};

// Component that load the graph
export const LoadGraph = (): null => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        const graph = new Graph();
        graph.addNode("first", {x: 0, y: 0, size: 15, label: "My first node", color: "#FA4F40"});
        loadGraph(graph);
    }, [loadGraph]);

    return null;
};

export const DisplayGraph = (): ReactElement => {
    return (
        <SigmaContainer style={sigmaStyle}>
            <LoadGraph/>
        </SigmaContainer>
    );
};