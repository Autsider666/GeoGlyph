import {ReactElement, ReactNode} from "react";

type PanelItemProps = {
    label: ReactNode,
    children: ReactElement,
}

export const PanelItem = ({label, children}: PanelItemProps): ReactElement =>
    <div className="level has-text-centered my-1">
        <label className="label my-auto">{label}</label>
        {children}
    </div>;