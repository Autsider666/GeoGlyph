import {Actor, Canvas, Entity, Vector} from "excalibur";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint, ViewPointModifiers} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent} from "./BlockVisibilityComponent.ts";

export class VisibilityLayerComponent extends BaseComponent {
    constructor(
        private readonly graphic: Canvas,
        private readonly modifiers: ViewPointModifiers,
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
        viewPoint.drawViewPoint(this.graphic.ctx, this.modifiers);
    }

    public drawBlocker(entity: Entity<BlockVisibilityComponent>): void {
        entity.get(BlockVisibilityComponent).drawIfVisible(this.graphic.ctx);
    }
}