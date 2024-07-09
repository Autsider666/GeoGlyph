import {NodeHoverDrawingFunction, NodeLabelDrawingFunction} from "sigma/rendering";
import {Settings} from "sigma/settings";
import {NodeDisplayData, PartialButFor, PlainObject} from "sigma/types";

export function drawRoundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}


const TEXT_COLOR = "#000000";

export const drawHover: NodeHoverDrawingFunction = (
    context: CanvasRenderingContext2D,
    data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
    settings: PlainObject,
): void => {
    const size = settings.labelSize;
    const font = settings.labelFont;
    const weight = settings.labelWeight;
    const subLabelSize = size - 2;

    const label = data.label;
    if (!label) {
        return;
    }

    const subLabel = data.tag !== "unknown" ? data.tag : "";
    const clusterLabel = data.clusterLabel;

    // Then we draw the label background
    context.beginPath();
    context.fillStyle = "#fff";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 2;
    context.shadowBlur = 8;
    context.shadowColor = "#000";

    context.font = `${weight} ${size}px ${font}`;
    const labelWidth = context.measureText(label).width;
    context.font = `${weight} ${subLabelSize}px ${font}`;
    const subLabelWidth = subLabel ? context.measureText(subLabel).width : 0;
    context.font = `${weight} ${subLabelSize}px ${font}`;
    const clusterLabelWidth = clusterLabel ? context.measureText(clusterLabel).width : 0;

    const textWidth = Math.max(labelWidth, subLabelWidth, clusterLabelWidth);

    const x = Math.round(data.x);
    const y = Math.round(data.y);
    const w = Math.round(textWidth + size / 2 + data.size + 3);
    const hLabel = Math.round(size / 2 + 4);
    const hSubLabel = subLabel ? Math.round(subLabelSize / 2 + 9) : 0;
    const hClusterLabel = clusterLabel ? Math.round(subLabelSize / 2 + 9) : 0;

    drawRoundRect(context, x, y - hSubLabel - 12, w, hClusterLabel + hLabel + hSubLabel + 12, 5);
    context.closePath();
    context.fill();

    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;

    // And finally we draw the labels
    context.fillStyle = TEXT_COLOR;
    context.font = `${weight} ${size}px ${font}`;
    context.fillText(label, data.x + data.size + 3, data.y + size / 3);

    if (subLabel) {
        context.fillStyle = TEXT_COLOR;
        context.font = `${weight} ${subLabelSize}px ${font}`;
        context.fillText(subLabel, data.x + data.size + 3, data.y - (2 * size) / 3 - 2);
    }

    if (clusterLabel) {
        context.fillStyle = data.color;
        context.font = `${weight} ${subLabelSize}px ${font}`;
        context.fillText(clusterLabel, data.x + data.size + 3, data.y + size / 3 + 3 + subLabelSize);
    }
};

export const drawLabel: NodeLabelDrawingFunction = (
    context: CanvasRenderingContext2D,
    data: PartialButFor<NodeDisplayData, "x" | "y" | "size" | "label" | "color">,
    settings: Settings,
): void => {
    if (!data.label) return;

    const size = settings.labelSize;
    const font = settings.labelFont;
    const weight = settings.labelWeight;

    context.font = `${weight} ${size}px ${font}`;
    // const width = context.measureText(data.label).width + 8;

    // context.fillStyle = "#ffffffcc";
    // context.fillRect(data.x + data.size, data.y + size / 3 - 15, width, 20);

    // context.fillStyle = "#000";
    context.fillStyle = "#FFF";
    context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
};