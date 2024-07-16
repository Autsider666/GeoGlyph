import {ReactElement} from "react";
import {ExcaliburContainer} from "../../Excalibur/ExcaliburContainer.tsx";
import {CustomNode} from "../types.ts";

export const ExcaliburNode = ():ReactElement => {
    return <div className="node" style={{borderRadius: 10}}>
        <div className="nodrag m-5">
            <ExcaliburContainer/>
        </div>
    </div>;
};

export const ExcaliburNodeToolBar: CustomNode = {
    label: 'EX',
    type: 'excalibur',
    element: ExcaliburNode
} as const;