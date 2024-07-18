import {Actor} from "excalibur";
import {DirtyCanvas} from "../../DirtyCanvas.ts";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class ShadowLayer extends Actor {
    constructor(
        {
            alpha = 1,
            color = '#000000'
        }: { alpha?: number, color?: string } = {}
    ) {
        let initialRun: boolean = true;

        super();

        this.addComponent(new VisibilityLayerComponent(
            new DirtyCanvas({
                width: 500,
                height: 500,
                // cache: true,
                draw: (ctx): void => {
                    if (initialRun) {
                        initialRun = false;

                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = color;
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        ctx.globalCompositeOperation = 'destination-out'; // Used to be destination-out
                    }
                }
            })
        ));
    }
}