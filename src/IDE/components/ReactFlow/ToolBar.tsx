import {NodeProps} from "@xyflow/react";
import classNames from "classnames";
import {ComponentType, DragEvent, ReactElement} from "react";

export type Tool = {
    type: string,
    name: string,
    element: ComponentType<NodeProps & {
        data: unknown;
        type: string;
    }>,
}

type ToolBarProps = {
    createNode: (type: string) => void,
    tools: Tool[],
}

export const ToolBar = (props: ToolBarProps): ReactElement => {

    const onDragStart = (event: DragEvent, nodeType: string): void => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';

    };

    return <div className="buttons has-addons is-centered is-transparent">
        {props.tools.map(({type, name}) =>
            <button
                key={type}
                className={classNames({
                    button: true,
                })}
                onDragStart={(event) => onDragStart(event, type)}
                draggable
                onClick={() => props.createNode(type)}
            >{name}</button>)}
    </div>;
};