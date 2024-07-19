import {Actor} from "excalibur";
import {BaseComponent} from "../../ECS/BaseComponent.ts";

export class ParentIndependentAngle extends BaseComponent {
    private lastAngle: number = 0;

    onAdd(owner: Actor): void {
        owner.on('postupdate', this.handleAngleUpdate.bind(this));
    }

    onRemove(previousOwner: Actor): void {
        previousOwner.off('postupdate', this.handleAngleUpdate.bind(this));
    }

    //TODO split between preUpdate and postUpdate in case actor wants own angle?
    private handleAngleUpdate(): void {
        const parent = this.owner?.parent;
        if (!(parent instanceof Actor) || !this.owner) {
            return;
        }

        const newRotation = parent.rotation;
        if (newRotation === this.lastAngle) {
            return;
        }


        this.owner.rotation += this.lastAngle;
        this.owner.rotation -= newRotation;
        this.lastAngle = newRotation;
    }
}