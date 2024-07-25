import {Actor, Canvas, Entity, InitializeEvent, Vector} from "excalibur";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent} from "./BlockVisibilityComponent.ts";

export class VisibilityLayerComponent extends BaseComponent {
    constructor(
        private readonly graphic: Canvas,
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        owner.anchor = Vector.Zero;
        owner.z = 50;
        owner.graphics.use(this.graphic);
        owner.on('initialize', this.onInitialize.bind(this));
    }

    public drawFieldOfView(viewPoint: ViewPoint): void {
        viewPoint.drawViewPoint(this.graphic.ctx);
    }

    public drawBlocker(entity: Entity<BlockVisibilityComponent>): void {
        entity.get(BlockVisibilityComponent).drawIfVisible(this.graphic.ctx);
    }

    onInitialize({engine}: InitializeEvent): void {
        this.graphic.width = engine.screen.canvasWidth;
        this.graphic.height = engine.screen.canvasHeight;
    }
}