import {Canvas} from "excalibur";
import {FieldOfViewLayer} from "./FieldOfViewLayer.ts";
import {Player} from "./Player.ts";

export class FogLayer extends FieldOfViewLayer {
    constructor(
        players: Player[],
        {
            alpha = 0.75,
            color = '#000000'
        }: {alpha?: number, color?:string} = {}
    ) {
        super(
            players,
            new Canvas({
                width: 500,
                height: 500,
                draw: (ctx): void => {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    this.drawFieldOfView(ctx);
                }
            }),
        );
    }
}