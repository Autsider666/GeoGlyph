import {EdgeProps, NodeProps} from "@xyflow/react";
import {ComponentType, ReactNode} from "react";

export type CustomNode<Data extends Record<string, unknown> = Record<string, unknown>> = {
    type: string,
    label: ReactNode,
    element: ComponentType<NodeProps & {
        data: Data;
        type: string;
    }>,
}

export type CustomEdge<Data extends Record<string, unknown> = Record<string, unknown>> = {
    type: string,
    label: ReactNode,
    element: ComponentType<EdgeProps & {
        data: Data;
        type: string;
    }>,
}