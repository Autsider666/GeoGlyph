import {Handle, NodeProps, Position} from "@xyflow/react";
import {memo, ReactElement} from "react";
import {FasIcon} from "../../Bulma/FasIcon";
import {CustomNode} from "../types.ts";

export const SourceNode = memo(({isConnectable}:NodeProps): ReactElement => {
    return <div className="source node">
        <Handle id="output" type="source" position={Position.Right} isConnectable={isConnectable} />
        <FasIcon icon="fa-play" iconStyle={{transform: 'rotate(-90deg)'}} size="large"
                 containerClasses={{'has-text-success': true}}/>
    </div>;
});

SourceNode.displayName = 'Source Node';

export const SourceNodeToolBar: CustomNode = {
    label: <FasIcon icon="fa-play" iconStyle={{transform: 'rotate(-90deg)'}} size="small"
                    containerClasses={{'has-text-success': true}}>Source</FasIcon>,
    type: 'source',
    element: SourceNode,
} as const;