import {Query, System, SystemPriority, SystemType, World} from "excalibur";
import {ViewpointComponent} from "../Component/ViewpointComponent.ts";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class VisibilitySystem extends System {
    systemType: SystemType = SystemType.Draw;
    priority: number = SystemPriority.Lowest;

    private readonly visibilityLayerQuery: Query<typeof VisibilityLayerComponent>;
    private readonly viewPointQuery: Query<typeof ViewpointComponent>;

    constructor(world: World) {
        super();

        this.visibilityLayerQuery = world.query([VisibilityLayerComponent]);
        this.viewPointQuery = world.query([ViewpointComponent]);
    }

    update(): void {
        for (const layerEntity of this.visibilityLayerQuery.entities) {
            const layer = layerEntity.get(VisibilityLayerComponent);
            for (const entity of this.viewPointQuery.entities) {
                const viewPoint = entity.get(ViewpointComponent);

                layer.drawFieldOfView(viewPoint);
            }
        }
    }

}