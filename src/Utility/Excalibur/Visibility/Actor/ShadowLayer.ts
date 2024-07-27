import {Actor, BoundingBox, Vector} from "excalibur";
import {DirtyCanvas} from "../../DirtyCanvas.ts";
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
        let initialRun: boolean = true;

        super({
            pos: bounds.center,
            anchor: Vector.Zero,
            width: bounds.width,
            height: bounds.height,
        });

        this.addComponent(new VisibilityLayerComponent(
            new DirtyCanvas({
                width: bounds.width,
                height: bounds.height,
                // cache: true,
                draw: (ctx): void => {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = color;

                    if (initialRun) {
                        initialRun = false;

                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    }

                    ctx.globalCompositeOperation = 'destination-out'; // Used to be destination-out
                }
            }),
            {insideAlpha, outsideAlpha}
        ));
    }
}