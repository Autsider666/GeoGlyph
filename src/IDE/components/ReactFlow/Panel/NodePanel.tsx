import {Node} from "@xyflow/react";
import {ReactElement, useEffect, useState} from "react";
import {EdgeSubPanel} from "./EdgeSubPanel.tsx";
import {NodePanelSection} from "./NodePanelSection.tsx";

type NodePanelProps = {
    nodes: Node[],
}

export const NodePanel = ({nodes}: NodePanelProps): ReactElement | undefined => {
    const [activeNodeTab, setActiveNodeTab] = useState<number | undefined>(nodes?.length ? 0 : undefined);

    useEffect(() => {
        if (nodes.length === 0) {
            setActiveNodeTab(undefined);
            return;
        }

        if (activeNodeTab === undefined) {
            setActiveNodeTab(0);
        }
    }, [activeNodeTab, nodes]);


    if (nodes.length === 0 || activeNodeTab === undefined) {
        return undefined;
    }

    const activeNode = nodes[activeNodeTab];

    return <nav className="panel is-primary has-background" style={{maxHeight: "100%"}}>
        <div className="panel-block is-size-5 has-text-weight-bold">
            Node: {activeNode.data.label?.toString() ?? activeNode.id}
        </div>

        {/*Tabs*/}
        {nodes.length < 2 ? undefined : <p className="panel-tabs">
            {nodes.map((node, index) => <a
                key={node.id}
                className={index === activeNodeTab ? 'is-active' : undefined}
                onClick={() => setActiveNodeTab(index)}
            >{node.data.label?.toString() ?? node.id}</a>)}
        </p>}

        {nodes
            .filter((_, index) => activeNodeTab === index)
            .map(node => <NodePanelSection key={node.id} nodeId={node.id}/>)}

        <EdgeSubPanel parentNode={nodes[activeNodeTab]?.id}/>
    </nav>;
};