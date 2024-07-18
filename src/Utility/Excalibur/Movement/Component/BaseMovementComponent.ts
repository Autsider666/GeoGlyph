import {Vector} from "excalibur";
import {BaseComponent} from "../../ECS/BaseComponent.ts";

export abstract class BaseMovementComponent extends BaseComponent {
    constructor(protected getSpeed: ()=>number = ()=>1) {
        super();
    }

    protected moveInDirection(direction: Vector, maxDistance?: number): void {
        if (this.owner === undefined) {
            return;
        }

        if (direction.x === 0 && direction.y === 0) {
            this.owner.vel.x = direction.x;
            this.owner.vel.y = direction.y;
            return;
        }

        let normalizedDirection = direction.normalize();

        const speed = this.getSpeed();
        normalizedDirection = normalizedDirection.scale(Math.min(speed, maxDistance ?? speed));
        this.owner.vel.x = normalizedDirection.x;
        this.owner.vel.y = normalizedDirection.y;
    }
}