import {Actor, BoundingBox, Canvas, Entity, Vector, GraphicOptions, RasterOptions, CanvasOptions} from "excalibur";
import {CanvasHelper} from "../../../Helper/CanvasHelper.ts";
import {DirtyCanvas} from "../../DirtyCanvas.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint, ViewPointModifiers} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent} from "./BlockVisibilityComponent.ts";

type VisibilityLayerArgs = {
    viewPointModifiers?: ViewPointModifiers,
    postProcessCallback?: (ctx: CanvasRenderingContext2D) => void,
} & LayerCanvasArgs;

type LayerCanvasArgs = {
    draw?: (ctx: CanvasRenderingContext2D) => void,
    initialDraw?: (ctx: CanvasRenderingContext2D) => void,
    resetBeforeDraw?: boolean,
    bounds: BoundingBox,
}

export class VisibilityLayerComponent extends BaseComponent {
    private readonly graphic: Canvas;
    private readonly viewPointModifiers: ViewPointModifiers;
    private readonly postProcessCallback?: (ctx: CanvasRenderingContext2D) => void;

    constructor(
        args: VisibilityLayerArgs,
    ) {
        super();

        this.viewPointModifiers = args.viewPointModifiers ?? {};
        this.postProcessCallback = args.postProcessCallback;

        this.graphic = this.createLayerCanvas(args);
    }

    onAdd(owner: Actor): void {
        owner.pos = Vector.Zero;
        owner.anchor = Vector.Zero;
        owner.z = 50;
        owner.graphics.use(this.graphic);
    }

    public drawFieldOfView(viewPoint: ViewPoint): void {
        this.graphic.flagDirty();
        this.runIsolated(ctx => viewPoint.drawViewPoint(ctx, this.viewPointModifiers));
    }

    public drawBlocker(entity: Entity<BlockVisibilityComponent>): void {
        this.runIsolated(ctx => entity.get(BlockVisibilityComponent).drawIfVisible(ctx));
    }

    public postProcess(): void {
        this.runIsolated(ctx => {
            if (!this.postProcessCallback) {
                return;
            }

            this.postProcessCallback(ctx);
        });
    }

    private runIsolated(callback: (ctx: CanvasRenderingContext2D) => void): void {
        CanvasHelper.isolateContextState(
            this.graphic.ctx,
            callback,
        );
    }

    private createLayerCanvas({
                                  draw,
                                  initialDraw,
                                  resetBeforeDraw = true,
                                  bounds,
                              }: LayerCanvasArgs): Canvas {
        const canvasOptions: GraphicOptions & RasterOptions & CanvasOptions = {
            draw,
            width: bounds.width,
            height: bounds.height,
            // cache: true,
        };

        const canvas = resetBeforeDraw ? new Canvas(canvasOptions) : new DirtyCanvas(canvasOptions);

        console.log(canvas, draw, initialDraw,resetBeforeDraw);
        if (initialDraw) {
            initialDraw(canvas.ctx);
        }

        return canvas;
    }
}