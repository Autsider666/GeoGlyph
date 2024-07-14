import {Handle, Position} from "@xyflow/react";
import {ReactElement} from "react";

type InputAwareHandleProps = {
    position?: Position,
    id: string,
    onChange: () => void,
    isConnectable: boolean,
}

export const InputAwareHandle = (props: InputAwareHandleProps): ReactElement => {
    //TODO
    return <Handle
        id="input"
        type="target"
        position={props.position ?? Position.Left}
        isConnectable={props.isConnectable}
    />;
};