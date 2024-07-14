import {Handle, Node, NodeProps, Position, useHandleConnections, useReactFlow} from "@xyflow/react";
import {ReactElement, useEffect, useState} from "react";
import {AutoWidth} from "../../Bulma/AutoWidth.tsx";
import {CustomNode} from "../types.ts";

type PoolNodeData = {
    value: number,
    step: number,
};

type PoolNode = Node<PoolNodeData, 'pool'>

export const PoolNode = ({id, isConnectable, data}: NodeProps<PoolNode>): ReactElement => {
    const [lastStep, setLastStep] = useState(data.step);
    const inputConnections = useHandleConnections({
        type: 'target',
        id: 'input',
    });
    const outputConnections = useHandleConnections({
        type: 'source',
        id: 'output',
    });
    const {getEdge, updateNodeData} = useReactFlow();
    const [value, setValue] = useState(data.value ?? 0);

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

    return <div className="pool node">
        <Handle id="input" type="target" position={Position.Left} isConnectable={isConnectable}/>
        <Handle id="output" type="source" position={Position.Right} isConnectable={isConnectable}/>
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
    </div>;
};

PoolNode.displayName = 'Pool Node';

export const PoolNodeToolBar: CustomNode<PoolNodeData> = {
    label: 'Pool Node',
    type: 'pool',
    // @ts-expect-error Valid for TS, not for PHPStorm
    element: PoolNode
} as const;