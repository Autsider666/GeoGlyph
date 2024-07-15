import {useHandleConnections} from "@xyflow/react";
import {ReactElement, useEffect, useState} from "react";
import {EdgePanelSection} from "./EdgePanelSection.tsx";

type EdgeSubPanelProps = {
    parentNode?: string,
}

export const EdgeSubPanel = ({parentNode}: EdgeSubPanelProps): ReactElement | undefined => {
    const [activeEdgeTab, setActiveEdgeTab] = useState<number | undefined>(undefined);
    const connections = useHandleConnections({
        type: 'source',
        id: 'output',
        nodeId: parentNode,
    });

    useEffect(() => {
        if (connections.length === 0) {
            setActiveEdgeTab(undefined);

            return;
        }

        if (activeEdgeTab === undefined || connections.length <= activeEdgeTab) {
            setActiveEdgeTab(0);
        }
    }, [connections, activeEdgeTab]);

    if (parentNode === undefined || activeEdgeTab === undefined) {
        return undefined;
    }

    return <>
        <p className="panel-tabs">
            {connections.map((connection, index) => <a
                key={connection.target}
                className={index === activeEdgeTab ? 'is-active' : undefined}
                onClick={() => setActiveEdgeTab(index)}
            >{connection.target}</a>)}
        </p>
        {connections
            .filter((_, index) => activeEdgeTab === index)
            .map(connection => <EdgePanelSection key={connection.edgeId} edgeId={connection.edgeId}/>)}
    </>;
};