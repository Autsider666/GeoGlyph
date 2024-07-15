import {Handle, NodeProps, Position} from "@xyflow/react";
import classNames from "classnames";
import {ReactElement} from "react";
import {FasIcon} from "../../Bulma/FasIcon";
import {CustomNode} from "../types.ts";

export const SinkNode = ({isConnectable, selected}: NodeProps): ReactElement => {
    return <div className={classNames({
        node: true,
        source: true,
        selected: selected,
    })}>
        <Handle id="input" type="target" position={Position.Left} isConnectable={isConnectable}/>
        <FasIcon icon="fa-play" iconStyle={{transform: 'rotate(90deg)'}} size="large"
                 containerClasses={{'has-text-warning': true}}/>
    </div>;
};

SinkNode.displayName = 'Sink Node';

export const SinkNodeToolBar: CustomNode = {
    label: <FasIcon icon="fa-play" iconStyle={{transform: 'rotate(90deg)'}} size="small"
                    containerClasses={{'has-text-warning': true}}>Sink</FasIcon>,
    type: 'sink',
    element: SinkNode
} as const;