import {useReactFlow} from "@xyflow/react";
import {ReactElement, useEffect, useState} from "react";
import {Input} from "../../Input/Input.tsx";
import {NumberInput} from "../../Input/NumberInput.tsx";
import {PanelItem} from "./PanelItem.tsx";

type NodePanelSectionProps = {
    nodeId: string,
}

export const NodePanelSection = ({nodeId}: NodePanelSectionProps): ReactElement | undefined => {
    const [data, setData] = useState<Record<string, unknown> | undefined>(undefined);
    const {getNode, updateNodeData} = useReactFlow();

    useEffect(() => {
        if (data !== undefined) {
            return;
        }

        const node = getNode(nodeId);
        if (!node) {
            throw new Error(`No node with id "${nodeId}" found.`);
        }

        if (node.data === undefined) {
            throw new Error(`Node "${nodeId}" does not contain "data" property.`);
        }

        setData(node.data);
    }, [data, nodeId, getNode]);

    if (data === undefined) {
        return undefined;
    }

    const onChange = (field: string) => (value: string | number): void => {
        updateNodeData(nodeId, {[field]: value});
        setData({
            ...data,
            [field]: value
        });
    };

    return <>
        {/*Search*/}
        {/*{fields.length > 2 ? <div className="panel-block">*/}
        {/*    <p className="control has-icons-left">*/}
        {/*        <input className="input" type="text" placeholder="Search"/>*/}
        {/*        <span className="icon is-left">*/}
        {/*            <i className="fas fa-search" aria-hidden="true"></i>*/}
        {/*        </span>*/}
        {/*    </p>*/}
        {/*</div> : undefined}*/}

        <div className="panel-block is-flex-direction-column has-text-left has-text-justified">
            <PanelItem label="Label">
                <Input value={data.label as string} onChange={onChange('label')} className="input" placeholder="Label"/>
            </PanelItem>
            <PanelItem label="Value">
                <NumberInput value={data.value} onChange={onChange('value')} className="input" placeholder="Label"/>
            </PanelItem>
        </div>
    </>;
};