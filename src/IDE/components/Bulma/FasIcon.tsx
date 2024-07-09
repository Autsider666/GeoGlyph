import classNames from "classnames";
import {ReactElement, ReactNode} from "react";
import {Size} from "./types.ts";

// https://fontawesome.com/search?o=r&m=free
export type FasIconType = `fa-${string}`;

type FasIconProps = {
    icon: FasIconType,
    size?: Size,
    children?: ReactNode,
    align?: 'left' | 'right',
}
export const FasIcon = (props: FasIconProps): ReactElement => {
    const icon = <span
        className={classNames({
            icon: true,
            [`is-${props.size ?? 'normal'}`]: true,
            'is-right': props.align === 'right',
        })}
    >
      <i className={classNames({
          fas: true,
          [props.icon]: true,
      })}></i>
    </span>;

    if (!props.children) {
        return icon;
    }

    return <span className="icon-text">
        {props.align !== "right" ? icon : undefined}
        <span>{props.children}</span>
        {props.align === "right" ? icon : undefined}
    </span>;
};