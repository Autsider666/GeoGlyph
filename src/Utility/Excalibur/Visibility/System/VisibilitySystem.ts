import {Query, System, SystemPriority, SystemType, World} from "excalibur";
import {NewViewpointComponent} from "../Component/NewViewpointComponent.ts";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class VisibilitySystem extends System {
    systemType: SystemType = SystemType.Draw;
    priority: number = SystemPriority.Lowest;

    private readonly visibilityLayerQuery: Query<typeof VisibilityLayerComponent>;
    private readonly viewPointQuery: Query<typeof NewViewpointComponent>;

    constructor(world: World) {
        super();

        this.visibilityLayerQuery = world.query([VisibilityLayerComponent]);
        this.viewPointQuery = world.query([NewViewpointComponent]);
    }

    update(): void {
        for (const layerEntity of this.visibilityLayerQuery.entities) {
            const layer = layerEntity.get(VisibilityLayerComponent);
            for (const entity of this.viewPointQuery.entities) {
                const viewPoint = entity.get(NewViewpointComponent);

                layer.drawFieldOfView(viewPoint);
            }
        }
    }

}