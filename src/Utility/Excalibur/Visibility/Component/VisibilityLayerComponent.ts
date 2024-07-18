import {Actor, Canvas, InitializeEvent, Vector} from "excalibur";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";

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

    onInitialize({engine}: InitializeEvent): void {
        this.graphic.width = engine.screen.canvasWidth;
        this.graphic.height = engine.screen.canvasHeight;
    }
}