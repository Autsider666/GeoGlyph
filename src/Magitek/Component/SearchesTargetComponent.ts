import {Actor, PreUpdateEvent, TagQuery} from "excalibur";
import {HasTargetComponent} from "../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {PreUpdateListeningComponent} from "../../Utility/Excalibur/ECS/PreUpdateListeningComponent.ts";

export class SearchesTargetComponent extends PreUpdateListeningComponent {
    private readonly queryTags: string[];
    private readonly maxDistance?: number;
    private query!: TagQuery<string>;
    private nextCheck: number = 0;

    constructor({queryTags, maxDistance}: { queryTags: string[], maxDistance?: number }) {
        super();

        this.queryTags = queryTags;
        this.maxDistance = maxDistance;
    }

    onPreUpdate({engine, delta}: PreUpdateEvent): void {
        const owner = this.owner;
        if (!owner) {
            return;
        }

        this.nextCheck -= delta;
        if (owner.has(HasTargetComponent) && this.nextCheck > 0) {
            return;
        }

        if (!this.query) {
            this.query = engine.currentScene.world.queryTags(this.queryTags);
        }

        let minDistance: number = Infinity;
        let closestTarget: Actor | undefined;

        for (const target of this.query?.entities ?? []) {
            if (!(target instanceof Actor)) {
                continue;
            }

            const distance = owner.pos.distance(target.pos);
            if (this.maxDistance && distance > this.maxDistance) { //FIXME pick closest target
                continue;
            }

            if (distance >= minDistance) {
                continue;
            }

            minDistance = distance;
            closestTarget = target;
        }

        this.nextCheck = 1000;

        if (closestTarget) {
            owner.addComponent(new HasTargetComponent(closestTarget), true);
        }
    }
}