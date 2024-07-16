import {Actor, Canvas, Color, Engine, Vector} from "excalibur";
import {Player} from "./Player.ts";

export abstract class FieldOfViewLayer extends Actor {
    protected constructor(
        protected readonly player: Player,
        protected readonly graphic: Canvas,
    ) {
        super({
            // pos,
            width: 500,
            height: 500,
            color: Color.Gray,
            anchor: Vector.Zero,
        });

        this.graphics.use(this.graphic);

        this.z = 50;
    }

    protected drawFieldOfView(
        ctx: CanvasRenderingContext2D,
    ): void {
        ctx.globalCompositeOperation = 'destination-out';

        ctx.globalAlpha = 1;
        ctx.fillStyle = this.posToGradient(
            ctx,
            this.player.pos,
            this.player.visionRadius,
            'rgba(0,0,0,0)',
            'rgba(0,0,0,1)',
            this.player.falloff
        );

        const centerX = this.player.pos.x;
        const centerY = this.player.pos.y;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
            centerX,
            centerY,
            this.player.visionRadius,
            this.player.fieldOfViewStartAngle,
            this.player.fieldOfViewEndAngle,
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

    onInitialize(engine: Engine): void {
        this.graphic.width = engine.screen.canvasWidth;
        this.graphic.height = engine.screen.canvasHeight;
    }
}