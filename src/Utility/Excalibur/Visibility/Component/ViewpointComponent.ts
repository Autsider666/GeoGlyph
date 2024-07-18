import {Vector} from "excalibur";
import {RadianHelper} from "../../../RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";

export class ViewpointComponent extends BaseComponent implements ViewPoint {
    constructor(
        public readonly angle: number = RadianHelper.Circle,
        public readonly range: number = Infinity,
        public readonly falloff: number = 0,
    ) {
        super();
    }

    drawViewPoint(ctx: CanvasRenderingContext2D): void {
        const owner = this.owner;
        if (!owner) {
            console.warn('Skipped drawing because of lack of owner');
            return;
        }

        const pos = owner.pos;
        const direction = owner.rotation;
        const startAngle = direction - this.angle / 2;
        const endAngle = direction + this.angle / 2;

        ctx.globalCompositeOperation = 'destination-out';

        ctx.globalAlpha = 1;

        ctx.fillStyle = this.posToGradient(
            ctx,
            pos,
            this.range,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,1)',
            this.falloff
        );

        const centerX = pos.x;
        const centerY = pos.y;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
            centerX,
            centerY,
            this.range,
            startAngle,
            endAngle,
        );

        ctx.closePath();
        ctx.fill();
    }

    protected posToGradient(
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
}