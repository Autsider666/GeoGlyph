import {Actor} from "excalibur";
import {BaseComponent} from "../BaseComponent.ts";

export class HasTargetComponent extends BaseComponent {
    constructor(public readonly target: Actor) {
        super();
    }

    onAdd(owner: Actor): void {
        owner.on('preupdate', this.onPreUpdate.bind(this));
    }


    private onPreUpdate(): void {
        if (this.target.isKilled()) {
            this.owner?.removeComponent(HasTargetComponent);
        }
    }
}