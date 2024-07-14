import {ReactElement, useEffect, useRef, useState} from "react";

type AutoWidthProps = {
    value: string | number | undefined,
    children: (width: number) => ReactElement,
}

export const AutoWidth = ({value, children}: AutoWidthProps): ReactElement => {
    const span = useRef<HTMLSpanElement | null>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(span.current?.offsetWidth ?? 0);
    }, [value]);

    return <>
    <span ref={span} style={{
        position: 'absolute',
        opacity: 0,
    }}>{value}</span>
        {children(width)}
    </>;
};