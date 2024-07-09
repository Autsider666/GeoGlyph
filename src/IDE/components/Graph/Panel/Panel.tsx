import {ReactElement, ReactNode} from "react";
import {CollapsibleCard} from "../../Bulma/CollapsibleCard.tsx";

type PanelProps = {
    title: ReactNode,
    children:ReactNode,
}

export const Panel = (props: PanelProps): ReactElement => <CollapsibleCard title={props.title}>
    {props.children}
</CollapsibleCard>;