import {Handle, NodeProps, Position} from "@xyflow/react";
import {ReactElement} from "react";
import {FasIcon} from "../../Bulma/FasIcon";
import {CustomNode} from "../types.ts";

export const SinkNode = ({isConnectable}:NodeProps): ReactElement => {
    return <div className="source node">
        <Handle id="input" type="target" position={Position.Left} isConnectable={isConnectable}/>
        <FasIcon icon="fa-play" iconStyle={{transform: 'rotate(90deg)'}} size="large"
                 containerClasses={{'has-text-warning': true}}/>
    </div>;
};

SinkNode.displayName = 'Sink Node';

export const SinkNodeToolBar: CustomNode = {
    label: 'Sink Node',
    type: 'sink',
    element: SinkNode
} as const;