import {ReactElement, ReactNode} from "react";
import {CollapsibleCard} from "../../Bulma/CollapsibleCard.tsx";

type PanelProps = {
    title: ReactNode,
    children: ReactNode,
    initializeExpanded?: boolean,
}

export const Panel = (props: PanelProps): ReactElement => <CollapsibleCard title={props.title}
                                                                           initializeExpanded={props.initializeExpanded}>
    {props.children}
</CollapsibleCard>;