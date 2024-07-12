import {
    addEdge,
    Background,
    Connection,
    Controls,
    MiniMap,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {CSSProperties, DragEvent, ReactElement, ReactNode, useCallback} from "react";
import {BackgroundPattern} from "../components/BackgroundPattern.tsx";
import {ToolBar} from "../components/ReactFlow/ToolBar.tsx";

type Node = {
    id: string, position: { x: number, y: number }, data: { label: ReactNode }
}

const initialNodes: Node[] = [
    {id: '1', position: {x: 0, y: 0}, data: {label: '1'}},
    {id: '2', position: {x: 0, y: 100}, data: {label: '2'}},
];

const initialEdges = [{id: 'e1-2', source: '1', target: '2'}];

let id = 0;
const getId = (): string => `dndnode_${id++}`;

const DnDFlow = ({style}: { style: CSSProperties }): ReactElement => {
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

    return <>
        <div className="fillScreen">
            <ReactFlow
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

        <ToolBar tools={[
            {type: 'input', name: 'Input Node'},
            {type: 'default', name: 'Default Node'},
            {type: 'output', name: 'Output Node'},
        ]}/>
    </>;
};

export const DisplayReactFlow = (): ReactElement => {


    return <BackgroundPattern
        type="Blueprint"
        typeSize={2}
        // backgroundColor={'#269'}
        backgroundColor={'transparent'}
        patternColor={'rgba(255,255,255, 0.1)'}
        // patternColor={'rgba(255,255,255, 0.50)'}
        patternSize={100}
    >
        {(style) => <ReactFlowProvider>
            <DnDFlow style={style}/>
        </ReactFlowProvider>}
    </BackgroundPattern>;
};