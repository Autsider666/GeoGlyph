import {DragEvent, ReactElement} from "react";

type Tool = {
    type: string,
    name: string,
}

type ToolBarProps = {
    tools: Tool[]
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
                className="button"
                onDragStart={(event) => onDragStart(event, type)}
                draggable
            >{name}</button>)}
    </div>;
};