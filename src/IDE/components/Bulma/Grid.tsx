import classNames from "classnames";
import {ReactElement} from "react";
import {Range} from "../../../Utility/Type/Range.ts";

type GridProps = {
    children: ReactElement | ReactElement[],
    width?: Range<1, 12>,
    gap?: Range<0, 8>,
    columnGap?: Range<0, 8>,
    rowGap?: Range<0, 8>,
}

export const Grid = (props: GridProps): ReactElement => {
    return <div className={classNames({
        grid: true,
        [`is-col-min-${props.width}`]: props.width !== undefined,
        [`is-gap-${props.gap}`]: props.gap !== undefined,
        [`is-column-gap-${props.columnGap}`]: props.columnGap !== undefined,
        [`is-row-gap-${props.rowGap}`]: props.rowGap !== undefined,
    })}>
        {props.children}
    </div>;
};