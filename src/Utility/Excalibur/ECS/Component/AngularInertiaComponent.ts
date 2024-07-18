import {Actor, Entity} from "excalibur";
import {BaseComponent} from "../BaseComponent.ts";

export class AngularInertiaComponent extends BaseComponent {
    private static defaultInertia: number = 250;

    constructor(private readonly getInertia: () => number = () => AngularInertiaComponent.defaultInertia) {
        super();
    }

    onAdd(owner: Actor): void {
        owner.on('postupdate', this.onPostUpdate.bind(this));
    }

    onRemove(previousOwner: Entity): void {
        previousOwner.off('postupdate', this.onPostUpdate.bind(this));
    }

    onPostUpdate(): void {
        const owner = this.owner;
        if (!owner) {
            return;
        }

        if (owner.vel.x === 0 && owner.vel.y === 0) {
            return;
        }

        let targetAngle: number = owner.vel.toAngle();
        if (owner.rotation - Math.PI > targetAngle) {
            targetAngle += 2 * Math.PI;
        }
        if (targetAngle - Math.PI > owner.rotation) {
            targetAngle -= 2 * Math.PI;
        }

        const angularDifference = Math.abs(owner.rotation - targetAngle);
        const angularInertia = Math.PI / this.getInertia();
        if (angularDifference > angularInertia) {
            if (angularDifference - Math.PI === 0) {
                owner.rotation += angularInertia * (Math.random() > 0.5 ? -1 : 1);
            } else if (targetAngle > owner.rotation) {
                owner.rotation += angularInertia;
            } else {
                owner.rotation -= angularInertia;
            }

        } else {
            owner.rotation = targetAngle;
        }
    }
}