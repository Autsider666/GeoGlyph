import {Actor, Canvas, Color, Engine, Vector} from "excalibur";

export class ShadowLayer extends Actor {
    private readonly graphic: Canvas;
    private pointerPos?: Vector;
    private readonly knownAreas: { pos: Vector, radius: number }[] = [];

    constructor() {
        super({
            // pos,
            width: 500,
            height: 500,
            color: Color.Gray,
            anchor: Vector.Zero,
        });

        this.z = 50;

        const darknessAlpha = 0.1;
        const fogAlpha = 1;
        const darkColor = '#000000';
        const fogColor = '#000000';
        const visionRadius = 150;
        const falloff = 0.5;//2/3;

        this.graphic = new Canvas({
            width: 500,
            height: 500,
            draw: (ctx): void => {
                //Draw Fog
                ctx.globalAlpha = fogAlpha;
                ctx.fillStyle = fogColor;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                if (!this.pointerPos) {
                    return;
                }


                //Draw Darkness
                ctx.globalAlpha = darknessAlpha; // TODO check for better fog vs light value
                ctx.fillStyle = darkColor;
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.globalCompositeOperation = 'destination-out'; // Used to be destination-out

                let pushPos = true;
                // if (this.knownAreas.length === 0) {
                //     this.knownAreas.push({
                //         gradient,
                //         pos: this.pointerPos.clone(),
                //         radius: visionRadius,
                //     });
                // }

                for (const {pos, radius} of this.knownAreas) {
                    // ctx.fillStyle = gradient;
                    ctx.fillStyle = this.posToGradient(
                        ctx,
                        pos,
                        radius,
                        'rgba(0,0,0,0)',
                        'rgba(0,0,0,1)',
                        0.1
                    );
                    ctx.fillStyle = 'rgba(115,115,115,0.25)';
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
                    ctx.closePath();
                    ctx.fill();

                    if (pos.distance(this.pointerPos) < radius / 100) {
                        pushPos = false;
                    }
                }

                if (pushPos) {
                    this.knownAreas.push({
                        pos: this.pointerPos.clone(),
                        radius: visionRadius,
                    });
                }

                //Draw Light
                ctx.globalCompositeOperation = 'destination-out';

                const centerX = this.pointerPos.x;
                const centerY = this.pointerPos.y;

                ctx.globalAlpha = 1; // TODO check for better fog vs light value
                ctx.fillStyle = this.posToGradient(
                    ctx,
                    this.pointerPos,
                    visionRadius,
                    'rgba(0,0,0,0)',
                    'rgba(0,0,0,1)',
                    falloff
                );

                ctx.beginPath();
                ctx.arc(centerX, centerY, visionRadius, 0, 2 * Math.PI);
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

    onPreUpdate(engine: Engine): void {
        this.pointerPos = engine.input.pointers.primary.lastWorldPos;//.sub(this.pos);

        for (const child of this.children) {
            if (child instanceof Actor) {
                child.z = -10;

                const graph = child.graphics.current;
                if (graph) {
                    const distanceOutsideView = this.pointerPos.distance(child.pos) - 150;
                    graph.opacity = distanceOutsideView < 0 ? 1 : 1 - (distanceOutsideView * 0.01);
                }
                // child.graphics.visible = this.pointerPos.distance(child.pos) - (child.width + child.height)/4 < 150;
            }
        }
    }
}