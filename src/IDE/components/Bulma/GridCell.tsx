import classNames from "classnames";
import {ReactElement, ReactNode} from "react";

type GridCellProps = {
    children: ReactNode,
    classNames?: Record<string, boolean>,
}

export const GridCell = (props: GridCellProps): ReactElement => {
    return <div className={classNames({
        cell: true,
        ...props.classNames,
    })}>
        {props.children}
    </div>;
};