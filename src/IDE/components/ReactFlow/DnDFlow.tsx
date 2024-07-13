import {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    NodeProps,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";
import {ComponentType, CSSProperties, DragEvent, ReactElement, useCallback, useMemo} from "react";
import {Tool, ToolBar} from "./ToolBar.tsx";

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
    customNodes?: Tool[],
}

export const DnDFlow = ({style, customNodes = []}: DnDFlowProps): ReactElement => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const {screenToFlowPosition} = useReactFlow();

    const onConnect = useCallback((params: Connection) => setEdges((currentEdges) => addEdge(params, currentEdges)), [setEdges]);

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

    return <>
        <div className="fillScreen">
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                colorMode={'dark'}
                fitView

            >
                <MiniMap/>
                <Controls/>
                <Background style={style} color={"transparent"}/>
            </ReactFlow>
        </div>

        <ToolBar tools={customNodes} createNode={onCreate}/>
    </>;
};