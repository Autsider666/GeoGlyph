import {Actor} from "excalibur";
import {DirtyTag} from "../../../../Magitek/Actor/tags.ts";
import {LifeCycleListeningComponent} from "./LifeCycleListeningComponent.ts";

export const DirtyEvent = 'dirty';

export class DirtyComponent extends LifeCycleListeningComponent {
    constructor() {
        super();

        this.on('postupdate', ({owner}) => this.onPostUpdate(owner));
    }

    private onPostUpdate(owner: Actor): void {
        if (!owner.pos.equals(owner.oldPos)) {
            owner.addTag(DirtyTag);
            owner.emit(DirtyEvent);
        } else {
            owner.removeTag(DirtyTag);
        }
    }

    public isDirty(): boolean {
        return this.owner?.hasTag(DirtyTag) ?? true;
    }
}