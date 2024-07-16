import {ChangeEvent, ReactElement, useEffect, useRef, useState} from "react";

type InputValue = string | number;

type AutoWidthInputProps = {
    value: InputValue,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AutoWidthInput = ({value, onChange}: AutoWidthInputProps): ReactElement => {
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
        <input
            type="text"
            className="input is-small is-rounded"
            value={value}
            onKeyDown={event => {
                if (event.key === 'Backspace') {
                    return;
                }

                if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                }
            }}
            onChange={onChange}
            style={{
                // display:"block",
                // margin:"auto",
                textAlign: 'center',
                width: width + 30,
            }}
        />
    </>;
};