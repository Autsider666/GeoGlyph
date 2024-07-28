import {GenericVector} from "../Type/Coordinate.ts";
import {RadianHelper} from "./RadianHelper.ts";

export class CanvasHelper {
    public static posToReverseGradient(
        ctx: CanvasRenderingContext2D,
        pos: GenericVector,
        visionRadius: number,
        lightColor: string,
        darkColor: string,
        falloff: number,
    ): CanvasGradient {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, visionRadius, pos.x, pos.y, visionRadius * falloff);
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(0.9, darkColor);

        return gradient;
    }

    public static posToGradient(
        ctx: CanvasRenderingContext2D,
        pos: GenericVector,
        visionRadius: number,
        colors: string[],
        falloff: number,
    ): CanvasGradient {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, visionRadius, pos.x, pos.y, visionRadius * falloff);
        const step = 1 / (colors.length - 1);
        let currentStep: number = 0;
        for (const color of colors) {
            gradient.addColorStop(currentStep, color);
            currentStep += step;
        }

        return gradient;
    }

    public static generatePolygonPath(points: GenericVector[]): Path2D {
        const polygon = new Path2D();
        const firstPoint = points.shift();
        if (!firstPoint) {
            console.log('Empty points?');
            return polygon;
        }

        polygon.moveTo(firstPoint.x, firstPoint.y);
        for (const point of points) {
            polygon.lineTo(point.x, point.y);
        }

        return polygon;
    }

    public static generateCirclePath(
        {x, y}: GenericVector,
        radius: number,
        startAngle: number = 0,
        endAngle: number = RadianHelper.Circle,
    ): Path2D {
        const circle = new Path2D();
        circle.arc(x, y, radius, startAngle, endAngle);

        return circle;
    }

    public static isolateContextState(ctx: CanvasRenderingContext2D, callback: (ctx: CanvasRenderingContext2D) => void): void {
        ctx.save();
        callback(ctx);
        ctx.restore();
    }
}