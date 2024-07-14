import {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    EdgeTypes,
    MarkerType,
    MiniMap,
    Node,
    NodeProps,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import {ComponentType, CSSProperties, DragEvent, ReactElement, useCallback, useEffect, useMemo, useState} from "react";
import {ToolBar} from "./ToolBar.tsx";
import {CustomEdge, CustomNode} from "./types.ts";

// type Node = {
//     id: string, position: { x: number, y: number }, data: Record<string,unknown>
// }

const initialNodes: Node[] = [
    // {
    //     id: 'node-1',
    //     type: 'source',
    //     position: {x: 0, y: 0},
    //     data: {},
    // },
];

const initialEdges: Edge[] = [
    // {id: 'e1-2', source: '1', target: '2'}
];

let id = 0;
const getId = (): string => `dndnode_${id++}`;

type DnDFlowProps = {
    style: CSSProperties,
    customNodes?: CustomNode[],
    customEdges?: CustomEdge[],
}

export const DnDFlow = ({style, customNodes = [], customEdges = []}: DnDFlowProps): ReactElement => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [step, setStep] = useState(0);
    const {screenToFlowPosition, updateNodeData} = useReactFlow();

    useEffect(() => {
        for (const {id, data} of nodes) {
            if (data.step === step) {
                continue;
            }

            updateNodeData(id, {step});
        }
    }, [step, nodes, updateNodeData]);

    const onConnect = useCallback((params: Connection) => {
        setEdges((currentEdges) => addEdge({
            type: 'value',
            markerEnd: {
                type: MarkerType.Arrow,
            },
            ...params,
        }, currentEdges));
    }, [setEdges]);

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            const newNode = {
                id: getId(),
                type,
                position,
                data: {label: <div>{type} node</div>},
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onCreate = useCallback((type: string): void => {
        const newNode = {
            id: getId(),
            type,
            position: {x: 0, y: 0},
            data: {},
        };

        setNodes((nds) => nds.concat(newNode));
    }, [setNodes]);

    const nodeTypes = useMemo(() => {
        const nodes: Record<string, ComponentType<NodeProps & {
            data: unknown;
            type: string;
        }>> = {};

        for (const {type, element} of customNodes) {
            nodes[type] = element;
        }

        return nodes;
    }, [customNodes]);

    const edgeTypes = useMemo(() => {
        const edges: EdgeTypes = {};

        for (const {type, element} of customEdges) {
            edges[type] = element;
        }

        return edges;
    }, [customEdges]);

    const onSimulate = (): void => setStep(step + 1);

    return <>
        <div className="fillScreen">
            <ReactFlow
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                colorMode={'dark'}
                fitView
                deleteKeyCode={['Backspace', 'Delete']}
            >
                <MiniMap/>
                <Controls/>
                <Background style={style} color={"transparent"}/>
            </ReactFlow>
        </div>

        <ToolBar onSimulate={onSimulate} nodes={customNodes} edges={customEdges} createNode={onCreate}/>
    </>;
};