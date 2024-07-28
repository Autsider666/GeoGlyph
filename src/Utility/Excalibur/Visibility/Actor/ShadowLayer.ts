import {Actor, BoundingBox, Vector} from "excalibur";
import {ViewPointModifiers} from "../../Utility/ViewPoint.ts";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class ShadowLayer extends Actor {
    constructor(
        bounds: BoundingBox,
        {
            alpha = 1,
            color = '#000000',
            insideAlpha = 1,
            outsideAlpha = 1,
        }: { alpha?: number, color?: string } & ViewPointModifiers = {}
    ) {
        super({
            name: 'ShadowLayer',
            pos: bounds.center,
            anchor: Vector.Zero,
            width: bounds.width,
            height: bounds.height,
        });

        this.addComponent(new VisibilityLayerComponent(
            {
                bounds,
                draw: (ctx: CanvasRenderingContext2D): void => {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = color;

                    ctx.globalCompositeOperation = 'destination-out'; // Used to be destination-out
                },
                initialDraw: (ctx): void => ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height),
                resetBeforeDraw: false,
                viewPointModifiers: {
                    insideAlpha,
                    outsideAlpha,
                }
            },
        ));
    }
}