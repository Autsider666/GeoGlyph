import {Actor, BoundingBox, Canvas, Vector} from "excalibur";
import {ViewPointModifiers} from "../../Utility/ViewPoint.ts";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class FogLayer extends Actor {
    constructor(
        bounds: BoundingBox,
        {
            alpha = 0.75,
            color = '#000000',
            insideAlpha = 0.5,
            outsideAlpha = 0,
        }: { alpha?: number, color?: string } & ViewPointModifiers = {}
    ) {
        super({
            pos: bounds.center,
            anchor: Vector.Zero,
        });

        this.addComponent(new VisibilityLayerComponent(
            new Canvas({
                width: bounds.width,
                height: bounds.height,
                // cache: true,
                draw: (ctx): void => {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx.globalCompositeOperation = 'destination-out';
                }
            }),
            {insideAlpha, outsideAlpha}
        ));
    }

    // onPreUpdate(engine: Engine): void {
    //     this.pos = engine.screenToWorldCoordinates(Vector.Zero);
    // }
}