import {forwardRef, PropsWithoutRef, ReactElement, ReactNode} from "react";

type CardProps = {
    header?: ReactNode,
    content?: ReactNode,
    children?: ReactNode,
    footer?: ReactNode,
}

export const Card = forwardRef<HTMLDivElement, PropsWithoutRef<CardProps>>((props: CardProps, ref): ReactElement =>
    <div className="card" ref={ref}>
        {props.header ? (
            <header className="card-header">{props.header}</header>
        ) : undefined}
        {props.children}
        {!props.children && props.content ? (
            <div className="card-content">{props.content}</div>
        ) : undefined}
        {props.footer ? (
            <div className="card-footer">{props.footer}</div>
        ) : undefined}
    </div>);