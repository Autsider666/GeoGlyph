import {useReactFlow} from "@xyflow/react";
import {ReactElement, useEffect, useState} from "react";
import {Input} from "../../Input/Input.tsx";
import {NumberInput} from "../../Input/NumberInput.tsx";
import {PanelItem} from "./PanelItem.tsx";

type EdgePanelSectionProps = {
    edgeId: string,
}

export const EdgePanelSection = ({edgeId}: EdgePanelSectionProps): ReactElement | undefined => {
    const [data, setData] = useState<Record<string, unknown> | undefined>(undefined);
    const {getEdge, updateEdgeData} = useReactFlow();

    useEffect(() => {
        if (data !== undefined) {
            return;
        }

        const edge = getEdge(edgeId);
        if (!edge) {
            throw new Error(`No edge with id "${edgeId}" found.`);
        }

        if (edge.data === undefined) {
            throw new Error(`Edge "${edgeId}" does not contain "data" property.`);
        }

        setData(edge.data);
    }, [data, edgeId, getEdge]);

    if (data === undefined) {
        return undefined;
    }

    const onChange = (field: string) => (value: string | number): void => {
        updateEdgeData(edgeId, {[field]: value});
        setData({
            ...data,
            [field]: value
        });
    };

    return <>
        <div className="panel-block is-flex-direction-column has-text-left has-text-justified">
            <PanelItem label="Label">
                <Input value={data.label as string} onChange={onChange('label')} className="input" placeholder="Label"/>
            </PanelItem>
            <PanelItem label="Value">
                <NumberInput value={data.value} onChange={onChange('value')} className="input"
                             placeholder="Label"/>
            </PanelItem>
        </div>
    </>;
};