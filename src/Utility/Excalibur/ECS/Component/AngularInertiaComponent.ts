import {Actor, Entity} from "excalibur";
import {BaseComponent} from "../BaseComponent.ts";

export class AngularInertiaComponent extends BaseComponent {
    private readonly angularInertia: number;

    constructor(inertia: number = 250) {
        super();

        this.angularInertia = Math.PI / inertia;
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
        if (angularDifference > this.angularInertia) {
            if (angularDifference - Math.PI === 0) {
                owner.rotation += this.angularInertia * (Math.random() > 0.5 ? -1 : 1);
            } else if (targetAngle > owner.rotation) {
                owner.rotation += this.angularInertia;
            } else {
                owner.rotation -= this.angularInertia;
            }

        } else {
            owner.rotation = targetAngle;
        }
    }
}