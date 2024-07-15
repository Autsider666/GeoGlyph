import {ReactElement} from "react";

export type NumberInputProps = {
    value: unknown,
    onChange: (newValue: number) => void,
    className?: string,
    placeholder?: string,
    allowDecimals?: boolean,
    maxDecimals?: number,
    allowNegative?: boolean,
    minValue?: number,
    maxValue?: number,
}

const isValid = (value: unknown): value is number | string | undefined => {
    const type = typeof value;
    return type === "string" || type === "number" || type === 'undefined';
};

export const NumberInput = ({
                                value,
                                onChange,
                                className,
                                placeholder,
                                allowDecimals,
                                maxDecimals,
                                allowNegative,
                                minValue,
                                maxValue,
                            }: NumberInputProps): ReactElement => {
    const type = typeof value;
    if (!isValid(value)) {
        throw new Error(`Invalid value type: ${type}`);
    }

    return <input
        value={value === '' ? 0 : value ?? 0}
        type="text"
        className={className}
        placeholder={placeholder}
        onKeyDown={event => {
            if (event.key === 'Backspace' || event.key === 'Delete') {
                return;
            }

            if (event.key === '.' && allowDecimals) {
                return;
            }

            if (event.key === '-' && allowNegative) {
                return;
            }

            if (/[0-9]/.test(event.key)) {
                return;
            }

            if (event.key.includes("Arrow")) {
                return;
            }

            event.preventDefault();
        }}
        onChange={({target}) => {
            const rawValue = target.value;
            if (!/^-?\d*(\.\d*)?$/.test(rawValue)) {
                return;
            }

            let value: number = parseFloat(rawValue);
            if (isNaN(value)) {
                value = 0; // In case of `.`, `-` or `-.`
            }

            if (!allowDecimals) {
                value = Math.round(value);
            } else if (maxDecimals !== undefined) {
                value = parseFloat(value.toFixed(maxDecimals));
            }

            if (!allowNegative && value < 0) {
                value = 0;
            }

            if (minValue !== undefined || maxValue !== undefined) {
                value = Math.max(Math.min(value, maxValue ?? Infinity), minValue ?? -Infinity);
            }

            onChange(value);
        }}
    />;
};