import {Actor, Canvas, Color, Engine, Vector} from "excalibur";
import {Player, PlayerViewCone} from "./Player.ts";

export class ShadowLayer extends Actor {
    private readonly graphic: Canvas;
    private readonly knownAreas: PlayerViewCone[] = [];
    private readonly player:Player;

    constructor() {
        super({
            // pos,
            width: 500,
            height: 500,
            color: Color.Gray,
            anchor: Vector.Zero,
        });

        this.z = 50;

        this.player = new Player({
            pos: new Vector(200,200),
            radius: 10,
            color: Color.Red,
        });
        this.addChild(this.player);

        // const darknessAlpha = 0.1;
        const fogAlpha = 1;
        const darkColor = '#000000';
        const fogColor = '#000000';
        const falloff = 0.25;//2/3;

        this.graphic = new Canvas({
            width: 500,
            height: 500,
            draw: (ctx): void => {
                //Draw Fog
                ctx.globalAlpha = fogAlpha;
                ctx.fillStyle = fogColor;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                // const lightingPos:Vector = this.player.pos;
                //
                // const fieldOfViewAngle = Math.PI /4;
                // const centerAngle = this.pointerPos.sub(lightingPos).toAngle();
                // const startAngle = centerAngle - fieldOfViewAngle;
                // const endAngle = centerAngle + fieldOfViewAngle;

                //Draw Darkness
                ctx.globalAlpha = 0.01; // TODO check for better fog vs light value
                ctx.fillStyle = darkColor;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.globalCompositeOperation = 'destination-out'; // Used to be destination-out

                let pushPos = true;
                for (const {pos, radius, startAngle, endAngle} of this.knownAreas) {
                    // ctx.fillStyle = gradient;
                    // ctx.fillStyle = this.posToGradient(
                    //     ctx,
                    //     pos,
                    //     radius,
                    //     'rgba(0,0,0,0)',
                    //     'rgba(0,0,0,1)',
                    //     0.5
                    // );
                    ctx.fillStyle = 'rgba(115,115,115,0.25)';
                    ctx.beginPath();
                    // ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI); //Full circle
                    ctx.moveTo(pos.x,pos.y);
                    ctx.arc(pos.x, pos.y, radius, startAngle, endAngle);
                    ctx.closePath();
                    ctx.fill();

                    if (pos.distance(this.player.pos) < radius / 50) {
                        pushPos = false;
                    }
                }

                if (pushPos) {
                    this.knownAreas.push(this.player.getViewCone());
                }

                //Draw Light
                ctx.globalCompositeOperation = 'destination-out';

                const centerX = this.player.pos.x;
                const centerY = this.player.pos.y;

                ctx.globalAlpha = 1; // TODO check for better fog vs light value
                ctx.fillStyle = this.posToGradient(
                    ctx,
                    this.player.pos,
                    this.player.visionRadius,
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,1)',
                    falloff
                );

                ctx.beginPath();
                // ctx.arc(centerX, centerY, visionRadius, 0, 2 * Math.PI); // FUll Circle
                ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI); // FUll Circle
                ctx.moveTo(centerX,centerY);
                ctx.arc(
                    centerX,
                    centerY,
                    this.player.visionRadius,
                    this.player.fieldOfViewStartAngle,
                    this.player.fieldOfViewEndAngle,
                    false,
                );
                ctx.closePath();
                ctx.fill();
            }
        });

        this.graphics.use(this.graphic);
    }

    private posToGradient(
        ctx: CanvasRenderingContext2D,
        pos: Vector,
        visionRadius: number,
        lightColor: string,
        darkColor: string,
        falloff: number,
    ): CanvasGradient {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, visionRadius, pos.x, pos.y, visionRadius * falloff); // /1.2 === * 2/3
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(1, darkColor);

        return gradient;
    }

    onInitialize(engine: Engine): void {
        this.graphic.width = engine.screen.canvasWidth;
        this.graphic.height = engine.screen.canvasHeight;
    }

    onPreUpdate(): void {
        for (const child of this.children) {
            if (child instanceof Player) {
                continue;
            }

            if (child instanceof Actor) {
                child.z = -10;

                const graph = child.graphics.current;
                if (graph) {
                    graph.opacity = this.player.canSee(child);
                }
            }
        }
    }
}