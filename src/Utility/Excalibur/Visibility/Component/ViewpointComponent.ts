import {Vector} from "excalibur";
import {RadianHelper} from "../../../RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";

type ViewPointData = {
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}

export class ViewpointComponent extends BaseComponent implements ViewPoint {
    private static defaultAngle: number = RadianHelper.Circle;
    private static defaultRange: number = Infinity;
    private static defaultFalloff: number = 0;

    constructor(
        private readonly viewPoints: ViewPointData[]
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
        const centerX = pos.x;
        const centerY = pos.y;
        const direction = owner.rotation;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;

        for (const {
            getAngle = (): number => ViewpointComponent.defaultAngle,
            getRange = (): number => ViewpointComponent.defaultRange,
            getFalloff = (): number => ViewpointComponent.defaultFalloff,
        } of this.viewPoints) {
            const angle = getAngle();
            const startAngle = direction - angle / 2;
            const endAngle = direction + angle / 2;


            const range = getRange();
            ctx.fillStyle = this.posToGradient(
                ctx,
                pos,
                range,
                'rgba(0,0,0,0)',
                'rgba(0,0,0,1)',
                getFalloff()
            );

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(
                centerX,
                centerY,
                range,
                startAngle,
                endAngle,
            );

            ctx.closePath();
            ctx.fill();
        }
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