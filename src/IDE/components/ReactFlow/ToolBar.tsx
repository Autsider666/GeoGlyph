import classNames from "classnames";
import {DragEvent, ReactElement} from "react";
import {FasIcon} from "../Bulma/FasIcon.tsx";
import {CustomEdge, CustomNode} from "./types.ts";

type ToolBarProps = {
    onSimulate: () => void,
    createNode: (type: string) => void,
    nodes?: CustomNode[],
    edges?: CustomEdge[],
}

export const ToolBar = (props: ToolBarProps): ReactElement => {
    const onDragStart = (event: DragEvent, nodeType: string): void => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return <div className="level">
        <div className="level-item">
            <span className="p-2">
                <div className="buttons has-addons is-centered is-transparent">
                    <span className="button is-static">Simulation</span>
                    <button
                        className={classNames({
                            button: true,
                        })}
                        onClick={props.onSimulate}
                    ><FasIcon icon="fa-play" /></button>
            </div>
            </span>
            {props.nodes === undefined ? undefined : <span className="p-2">
                <div className="buttons has-addons is-centered is-transparent">
                    <span className="button is-static">Nodes</span>
                    {props.nodes.map(({type, label}) =>
                        <button
                            key={type}
                            className={classNames({
                                button: true,
                            })}
                            onDragStart={(event) => onDragStart(event, type)}
                            draggable
                            onClick={() => props.createNode(type)}
                        >{label}</button>)}
            </div>
            </span>}
            {props.edges === undefined ? undefined : <span>
                <div className="buttons has-addons is-centered is-transparent">
                    <span className="button is-static">Edges</span>
                    {props.edges.map(({type, label}) =>
                        <button
                            key={type}
                            className={classNames({
                                button: true,
                            })}
                            onDragStart={(event) => onDragStart(event, type)}
                            draggable
                            // onClick={() => props.createNode(type)}
                        >{label}</button>)}
            </div>
            </span>}
        </div>
    </div>;
};