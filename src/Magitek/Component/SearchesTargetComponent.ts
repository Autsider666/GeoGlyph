import {Actor, PreUpdateEvent, TagQuery} from "excalibur";
import {HasTargetComponent} from "../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {PreUpdateListeningComponent} from "../../Utility/Excalibur/ECS/PreUpdateListeningComponent.ts";

export class SearchesTargetComponent extends PreUpdateListeningComponent {
    private readonly queryTags: string[];
    private readonly maxDistance?: number;
    private query: TagQuery<string> | undefined = undefined;

    constructor({queryTags, maxDistance}: { queryTags: string[], maxDistance?: number }) {
        super();

        this.queryTags = queryTags;
        this.maxDistance = maxDistance;
    }

    onPreUpdate({engine}: PreUpdateEvent): void {
        const owner = this.owner;
        if (!owner || owner.has(HasTargetComponent)) {
            return;
        }

        if (!this.query) {
            this.query = engine.currentScene.world.queryTags(this.queryTags);
        }

        for (const target of this.query?.entities ?? []) {
            if (!(target instanceof Actor)) {
                continue;
            }

            if (this.maxDistance && owner.pos.distance(target.pos) > this.maxDistance) { //FIXME pick closest target
                continue;
            }

            owner.addComponent(new HasTargetComponent(target));
            break;
        }
    }
}