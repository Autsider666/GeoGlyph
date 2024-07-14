import {BaseEdge, Edge, EdgeLabelRenderer, EdgeProps, getSmoothStepPath, useReactFlow} from "@xyflow/react";
import {ReactElement, useEffect, useState} from "react";
import {AutoWidth} from "../../Bulma/AutoWidth.tsx";
import {CustomEdge} from "../types.ts";

type ValueEdge = Edge<{ value: number }, 'value'>;

export const ValueEdge = ({
                              id,
                              data,
                              sourceX,
                              sourceY,
                              targetX,
                              targetY,
                              sourcePosition,
                              targetPosition,
                              style = {},
                              markerEnd,
                          }: EdgeProps<ValueEdge>): ReactElement => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const [value, setValue] = useState(data?.value ?? 1);
    const {updateEdgeData} = useReactFlow();

    useEffect(() => {
        if (value !== data?.value) {
            updateEdgeData(id, {value});
        }
    }, [data?.value, id, updateEdgeData, value]);

    return <>
        <BaseEdge path={edgePath} markerEnd={markerEnd} style={style}/>
        <EdgeLabelRenderer>
            <div
                style={{
                    position: 'absolute',
                    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    fontSize: 12,
                    // everything inside EdgeLabelRenderer has no pointer events by default
                    // if you have an interactive element, set pointer-events: all
                    pointerEvents: 'all',
                    // width: 50,
                }}
                className="nodrag nopan"
            >
                <AutoWidth value={value}>
                    {width => <input
                        type="text"
                        className="input is-small is-rounded"
                        value={value}
                        onKeyDown={event => {
                            if (event.key === 'Backspace') {
                                return;
                            }

                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={({target}) => {
                            let value: number = parseInt(target.value);
                            if (isNaN(value)) {
                                value = 0;
                            }

                            setValue(value);
                        }}
                        style={{
                            // display:"block",
                            // margin:"auto",
                            textAlign: 'center',
                            width: width + 30,
                        }}
                    />}
                </AutoWidth>
            </div>
        </EdgeLabelRenderer>
    </>;
};

export const ValueEdgeToolbar: CustomEdge<{ value: number }> = {
    type: 'value',
    label: 'Value Edge',
    element: ValueEdge,
} as const;