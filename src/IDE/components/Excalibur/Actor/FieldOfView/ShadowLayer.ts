import {DirtyCanvas} from "../../../../../Utility/Excalibur/DirtyCanvas.ts";
import {FieldOfViewLayer} from "./FieldOfViewLayer.ts";
import {Player} from "./Player.ts";

export class ShadowLayer extends FieldOfViewLayer {
    constructor(
        player: Player,
        {
            alpha = 1,
            color = '#000000'
        }: { alpha?: number, color?: string } = {}
    ) {
        let initialRun: boolean = true;

        super(
            player,
            new DirtyCanvas({
                width: 500,
                height: 500,
                draw: (ctx): void => {
                    if (initialRun) {
                        initialRun = false;

                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = color;
                        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                        ctx.globalCompositeOperation = 'destination-out'; // Used to be destination-out
                    }

                    this.drawFieldOfView(ctx,0,Math.PI*2);
                }
            })
        );
    }
}