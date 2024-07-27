import {Actor, Canvas, Entity, Vector} from "excalibur";
import {CanvasHelper} from "../../../Helper/CanvasHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint, ViewPointModifiers} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent} from "./BlockVisibilityComponent.ts";

export class VisibilityLayerComponent extends BaseComponent {
    constructor(
        private readonly graphic: Canvas,
        private readonly modifiers: ViewPointModifiers,
        private readonly postProcessCallback?: (ctx: CanvasRenderingContext2D) => void,
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        owner.pos = Vector.Zero;
        owner.anchor = Vector.Zero;
        owner.z = 50;
        owner.graphics.use(this.graphic);
    }

    public drawFieldOfView(viewPoint: ViewPoint): void {
        this.runIsolated(ctx => viewPoint.drawViewPoint(ctx, this.modifiers));
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

    private runIsolated(callback: (ctx:CanvasRenderingContext2D)=>void):void {
        CanvasHelper.isolateContextState(
            this.graphic.ctx,
            callback,
        );
    }
}