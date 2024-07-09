import {ReactElement, ReactNode, useEffect, useRef, useState} from "react";
import AnimateHeight from "react-animate-height";
import {Button} from "./Button.tsx";
import {Card} from "./Card.tsx";
import {FasIcon} from "./FasIcon.tsx";

type CollapsibleCardProps = {
    duration?: number,
    title: ReactNode,
    children: ReactNode,
    expanded?: boolean,
}

export const CollapsibleCard = (props: CollapsibleCardProps): ReactElement => {
    const [expanded, setExpanded] = useState<boolean>(props.expanded ?? false);
    const dom = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (expanded)
            setTimeout(() => {
                if (dom.current) dom.current.parentElement?.scrollTo({
                    top: dom.current.offsetTop - 5,
                    behavior: "smooth"
                });
            }, props.duration ?? 300);
    }, [expanded, props.duration]);

    const header = <>
        <Button onClick={() => setExpanded(!expanded)} classNames={{
            button: false,
            'card-header-title': true,
            'is-fullwidth': true,
            // 'card-header-icon': true,
        }}>{props.title}</Button>
        {/*<div className="card-header-title">{props.title}</div>*/}
        <Button onClick={() => setExpanded(!expanded)} classNames={{
            button: false,
            'card-header-icon': true,
        }}>
            <FasIcon icon={expanded ? "fa-angle-up" : "fa-angle-down"} align="right"></FasIcon>
        </Button>

    </>;

    return <Card
        header={header}
        ref={dom}
    >
        <AnimateHeight duration={props.duration ?? 300} height={expanded ? "auto" : 0}>
            <div className="card-content">
                {props.children}
            </div>
        </AnimateHeight>
    </Card>;
};