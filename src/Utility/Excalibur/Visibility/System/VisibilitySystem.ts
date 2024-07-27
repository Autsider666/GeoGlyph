import {Query, System, SystemPriority, SystemType, World} from "excalibur";
import {BlockVisibilityComponent} from "../Component/BlockVisibilityComponent.ts";
import {ViewpointComponent} from "../Component/ViewpointComponent.ts";
import {VisibilityLayerComponent} from "../Component/VisibilityLayerComponent.ts";

export class VisibilitySystem extends System {
    systemType: SystemType = SystemType.Draw;
    priority: number = SystemPriority.Average;

    private readonly visibilityLayerQuery: Query<typeof VisibilityLayerComponent>;
    private readonly viewPointQuery: Query<typeof ViewpointComponent>;
    private readonly visibilityBlockerQuery: Query<typeof BlockVisibilityComponent>;

    constructor(world: World) {
        super();

        this.visibilityLayerQuery = world.query([VisibilityLayerComponent]);
        this.viewPointQuery = world.query([ViewpointComponent]);
        this.visibilityBlockerQuery = world.query([BlockVisibilityComponent]);
    }

    update(): void {
        for (const layerEntity of this.visibilityLayerQuery.entities) {
            const layer = layerEntity.get(VisibilityLayerComponent);
            for (const entity of this.viewPointQuery.entities) {
                const viewPoint = entity.get(ViewpointComponent);

                layer.drawFieldOfView(viewPoint);
            }

            for (const entity of this.visibilityBlockerQuery.entities) {
                layer.drawBlocker(entity);
            }

            layer.postProcess();
        }
    }

}