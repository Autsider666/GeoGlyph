import {Actor, Canvas, Engine, Vector} from "excalibur";
import {Player} from "./Player.ts";

export abstract class FieldOfViewLayer extends Actor {
    protected constructor(
        protected readonly players: Player[],
        protected readonly graphic: Canvas,
    ) {
        super({
            anchor: Vector.Zero,
        });

        this.graphics.use(this.graphic);

        this.z = 50;
    }

    protected drawFieldOfView(
        ctx: CanvasRenderingContext2D,
        startAngle?: number,
        endAngle?: number,
    ): void {
        ctx.globalCompositeOperation = 'destination-out';

        ctx.globalAlpha = 1;
        for (const player of this.players) {
            ctx.fillStyle = this.posToGradient(
                ctx,
                player.pos,
                player.visionRadius,
                'rgba(0,0,0,0)',
                'rgba(0,0,0,1)',
                player.falloff
            );

            const centerX = player.pos.x;
            const centerY = player.pos.y;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(
                centerX,
                centerY,
                player.visionRadius,
                startAngle ?? player.fieldOfViewStartAngle,
                endAngle ?? player.fieldOfViewEndAngle,
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

    onInitialize(engine: Engine): void {
        this.graphic.width = engine.screen.canvasWidth;
        this.graphic.height = engine.screen.canvasHeight;
    }
}