import {Handle, Node, NodeProps, Position, useHandleConnections, useReactFlow} from "@xyflow/react";
import {ReactElement, useEffect, useRef, useState} from "react";
import {AutoWidth} from "../../Bulma/AutoWidth.tsx";
import {FasIcon} from "../../Bulma/FasIcon.tsx";
import {CustomNode} from "../types.ts";

type PoolNodeData = {
    value: number,
    step: number,
    label?: string,
};

type PoolNode = Node<PoolNodeData, 'pool'>

export const PoolNode = ({id, isConnectable, data}: NodeProps<PoolNode>): ReactElement => {
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const [lastStep, setLastStep] = useState(data.step);
    const inputConnections = useHandleConnections({
        nodeId: id,
        type: 'target',
        id: 'input',
    });
    const outputConnections = useHandleConnections({
        nodeId: id,
        type: 'source',
        id: 'output',
    });
    const {getEdge, updateNodeData} = useReactFlow();
    const [value, setValue] = useState(data.value ?? 0);
    const [verticalCenter, setVerticalCenter] = useState<number>(0);

    useEffect(() => {
        setVerticalCenter((nodeRef.current?.clientHeight ?? 0)/2);
    }, [data.label]);

    useEffect(() => {
        if (data.step === lastStep) {
            return;
        }

        let deltaValue: number = 0;
        for (const {edgeId} of inputConnections) {
            const edge = getEdge(edgeId);
            const value = edge?.data?.value;
            if (value === undefined || typeof value !== 'number') {
                continue;
            }

            deltaValue += value;
        }

        for (const {edgeId} of outputConnections) {
            const edge = getEdge(edgeId);
            const value = edge?.data?.value;
            if (value === undefined || typeof value !== 'number') {
                continue;
            }

            deltaValue -= value;
        }

        if (deltaValue !== 0) {
            setValue(Math.max(0, value + deltaValue));
        }

        setLastStep(data.step);
    }, [data.step, getEdge, inputConnections, lastStep, outputConnections, value]);

    useEffect(() => {
        if (data.value !== value) {
            updateNodeData(id, {value});
        }
    }, [data.value, id, updateNodeData, value]);

    return <>
        <div className="pool node" ref={nodeRef}>
            <Handle id="input" type="target" position={Position.Left} isConnectable={isConnectable} style={{top: verticalCenter}}/>
            <Handle id="output" type="source" position={Position.Right} isConnectable={isConnectable} style={{top: verticalCenter}}/>
            {/*<FasIcon icon="fa-box" size="large"*/}
            {/*         containerClasses={{'has-text-warning': true}}/>*/}
            <AutoWidth value={data.step}>
                {width =>
                    // <div className="control has-icons-left has-icons-right" style={{width:width+50}}>
                    <input className="input" type="string" value={value} readOnly
                           style={{textAlign: 'center', width: width + 40}}/>
                    // <FasIcon icon="fa-box" size="small" align="left"/>
                    // </div>
                }
            </AutoWidth>
        </div>
        {data.label ? <div className="has-text-centered mx-auto is-size-7">{data.label}</div> : undefined}
    </>;
};

PoolNode.displayName = 'Pool Node';

export const PoolNodeToolBar: CustomNode<PoolNodeData> = {
    label: <FasIcon icon="fa-database" size="small"
                    containerClasses={{'has-text-success': false}}>Pool</FasIcon>,
    type: 'pool',
    // @ts-expect-error Valid for TS, not for PHPStorm
    element: PoolNode
} as const;