import {Vector} from "excalibur";

export class CanvasHelper {
    public static posToGradient(
        ctx: CanvasRenderingContext2D,
        pos: Vector,
        visionRadius: number,
        lightColor: string,
        darkColor: string,
        falloff: number,
    ): CanvasGradient {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, visionRadius, pos.x, pos.y, visionRadius * falloff);
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(1, darkColor);

        return gradient;
    }

    public static drawPolygon(ctx: CanvasRenderingContext2D, points: Vector[]): void {
        const polygon = new Path2D();
        const firstPoint = points.shift();
        if (!firstPoint) {
            console.log('Empty points?');
            return;
        }

        polygon.moveTo(firstPoint.x, firstPoint.y);
        for (const point of points) {
            polygon.lineTo(point.x, point.y);
        }

        ctx.fill(polygon);
    }
}