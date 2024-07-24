import {Actor, Canvas} from "excalibur";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class FogLayer extends Actor {
    constructor(
        {
            alpha = 0.75,
            color = '#000000'
        }: { alpha?: number, color?: string } = {}
    ) {
        super();

        this.addComponent(new VisibilityLayerComponent(
            new Canvas({
                width: 500,
                height: 500,
                // cache: true,
                draw: (ctx): void => {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                }
            }),
        ));
    }

    // onPreUpdate(engine: Engine): void {
    //     this.pos = engine.screenToWorldCoordinates(Vector.Zero);
    // }
}