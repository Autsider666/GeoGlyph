import {Actor, BoundingBox, Vector} from "excalibur";
import {ViewPointModifiers} from "../../Utility/ViewPoint.ts";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class FogLayer extends Actor {
    constructor(
        bounds: BoundingBox,
        {
            alpha = 0.75,
            color = '#000000',
            defaultModifiers = {
                getInsideAlpha: (): number => 0.5,
                getOutsideAlpha: (): number => 0,
            }
        }: { alpha?: number, color?: string, defaultModifiers?: ViewPointModifiers } = {}
    ) {
        super({
            name: 'FogLayer',
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
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    ctx.globalCompositeOperation = 'destination-out';
                },
                viewPointModifiers: defaultModifiers,
                postProcessCallback: this.postProcess.bind(this),
            },
        ));
    }

    private postProcess(ctx: CanvasRenderingContext2D): void {
        ctx.globalCompositeOperation = 'luminosity';

        ctx.fillStyle = 'rgb(0,0,0,0.25)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}