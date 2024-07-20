import {Actor, System, SystemType, TagQuery, World} from "excalibur";
import {ViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {EnemyTag, FriendlyTag, VisibleTag} from "../Actor/tags.ts";

export class EnemyVisibilitySystem extends System {
    systemType: SystemType = SystemType.Update;

    private readonly enemyQuery: TagQuery<typeof EnemyTag>;
    private readonly friendlyQuery: TagQuery<typeof FriendlyTag>;

    private readonly enemyActors: Actor[] = [];
    private readonly friendlyActors: Actor[] = [];

    constructor(world: World) {
        super();

        this.enemyQuery = world.queryTags([EnemyTag]);

        this.enemyQuery.entityAdded$.subscribe(entity => {
            if (entity instanceof Actor && !this.enemyActors.includes(entity)) {
                this.enemyActors.push(entity);
            }
        });

        this.enemyQuery.entityRemoved$.subscribe(entity => {
            if (entity instanceof Actor && this.enemyActors.includes(entity)) {
                this.enemyActors.splice(this.enemyActors.indexOf(entity), 1);
            }
        });

        this.friendlyQuery = world.queryTags([FriendlyTag]);

        this.friendlyQuery.entityAdded$.subscribe(entity => {
            if (entity instanceof Actor && entity.has(ViewpointComponent) && !this.friendlyActors.includes(entity)) {
                this.friendlyActors.push(entity);
            }
        });

        this.friendlyQuery.entityRemoved$.subscribe(entity => {
            if (entity instanceof Actor && this.friendlyActors.includes(entity)) {
                this.friendlyActors.splice(this.friendlyActors.indexOf(entity), 1);
            }
        });
    }

    update(): void {
        for (const enemyActor of this.enemyActors) {
            let visibility: number = 0;
            for (const friendlyActor of this.friendlyActors) {
                visibility = Math.max(visibility, friendlyActor.get(ViewpointComponent).canSee(enemyActor) ?? 0);
            }


            if (visibility === 0) {
                enemyActor.removeTag(VisibleTag);
            } else {
                enemyActor.addTag(VisibleTag);
            }

            enemyActor.graphics.opacity = Math.min(visibility * 5, 2);
        }
    }
}