import classNames from "classnames";
import {CSSProperties, ReactElement, ReactNode} from "react";
import {Size} from "./types.ts";

// https://fontawesome.com/search?o=r&m=free
export type FasIconType = `fa-${string}`;

type FasIconProps = {
    icon: FasIconType,
    size?: Size,
    children?: ReactNode,
    align?: 'left' | 'right',
    containerClasses?: Record<string, boolean>,
    containerStyle?: CSSProperties,
    iconClasses?: Record<string, boolean>,
    iconStyle?: CSSProperties,
}
export const FasIcon = (props: FasIconProps): ReactElement => {
    const icon = <span
        className={classNames({
            icon: true,
            [`is-${props.size ?? 'normal'}`]: true,
            'is-right': props.align === 'right',
            'is-left': props.align === 'left',
            ...props.containerClasses
        })}
        style={props.containerStyle}
    >
      <i className={classNames({
          fas: true,
          [props.icon]: true,
          'fa-lg': props.size === 'medium',
          'fa-2x': props.size === 'large',
          ...props.iconClasses,
      })} style={props.iconStyle}></i>
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