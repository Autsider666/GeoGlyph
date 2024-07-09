import classNames from "classnames";
import {ReactElement, ReactNode} from "react";

type ButtonProps = {
    children: ReactNode,
    onClick?: () => void,
    classNames?: Record<string, boolean>
}

export const Button = (props: ButtonProps): ReactElement => {

    return <button
        className={classNames({
            button:true,
            ...props.classNames,
        })}
        onClick={props.onClick}
    >
        {props.children}
    </button>;
};