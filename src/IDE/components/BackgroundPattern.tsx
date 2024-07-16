import {DataType} from "csstype";
import {CSSProperties, ReactElement} from "react";

enum Pattern {
    None = 'None',
    Dots = 'Dots',
    CrossDots = 'CrossDots',
    Grid = 'Grid',
    Blueprint = 'Blueprint',
}

type BackgroundPatternProps = {
    children: (style: CSSProperties) => ReactElement,
} & BackgroundImageOptions

type BackgroundImageOptions = {
    type: keyof typeof Pattern,
    backgroundColor: DataType.Color,
    patternColor: DataType.Color,
    typeSize: number,
    patternSize: number,
}

const round = (value: number, decimals: number = 1): string => value.toFixed(decimals);

const generateStyle = ({
                           type,
                           typeSize,
                           patternColor,
                           patternSize,
                           backgroundColor,
                       }: BackgroundImageOptions): CSSProperties => {
    const style: CSSProperties = {
        backgroundSize: `${patternSize}px ${patternSize}px`,
        backgroundColor: backgroundColor,
    };

    const halfSize = round(typeSize / 2);
    const offset = round(patternSize / 2);

    switch (type) {
        case "None":
            break;
        case "Dots":
            style.backgroundImage = `radial-gradient(${patternColor} ${typeSize}px, transparent ${typeSize}px)`;
            break;
        case "CrossDots":
            style.backgroundImage = `radial-gradient(${patternColor} ${typeSize}px, transparent ${typeSize}px), radial-gradient(${patternColor} ${typeSize}px, transparent ${typeSize}px)`;
            style.backgroundPosition = `0 0, ${round(patternSize / 2)}px ${round(patternSize / 2)}px`;
            break;
        case "Grid":
            style.backgroundImage = `linear-gradient(${patternColor} ${typeSize}px, transparent ${typeSize}px), linear-gradient(to right, ${patternColor} ${typeSize}px, transparent ${typeSize}px)`;
            style.backgroundPosition = `${offset}px ${offset}px, ${offset}px ${offset}px`;
            break;
        case "Blueprint":
            // @ts-expect-error Could be a bit too complex
            style.backgroundImage = `linear-gradient(${patternColor} ${typeSize}px, transparent ${typeSize}px),
    linear-gradient(90deg, ${patternColor} ${typeSize}px, transparent ${typeSize}px),
    linear-gradient(${patternColor} ${halfSize}px, transparent ${halfSize}px),
    linear-gradient(90deg, ${patternColor} ${halfSize}px, transparent ${halfSize}px)`;
            style.backgroundSize = `${patternSize}px ${patternSize}px, ${patternSize}px ${patternSize}px, ${round(patternSize / 5)}px ${round(patternSize / 5)}px, ${round(patternSize / 5)}px ${round(patternSize / 5)}px`;
            style.backgroundPosition = `${offset}px ${offset}px, ${offset}px ${offset}px`;
            break;
        default:
            throw new Error(`Background pattern "${type}" is not implemented yet.`);
    }

    return style;
};

export const BackgroundPattern = (props: BackgroundPatternProps): ReactElement => {
    return props.children(generateStyle(props));
};