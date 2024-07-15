import {ReactElement} from "react";
import {NumberInput, NumberInputProps} from "./NumberInput.tsx";

type InputProps = {
    type: 'number'
} & NumberInputProps | {
    type?: 'text',
    className?: string,
    placeholder?: string,
    value: string | undefined,
    onChange: (newValue: string) => void,
}

export const Input = (props: InputProps): ReactElement => {
    if (props.type === 'number') {
        return <NumberInput {...props} />;
    }

    return <input {...props} onChange={event => props.onChange(event.target.value)}/>;
};