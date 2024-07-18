import {Vector} from "excalibur";
import {BaseComponent} from "../../ECS/BaseComponent.ts";

export abstract class BaseMovementComponent extends BaseComponent {
    constructor(protected speed: number = 1) {
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
        // this.owner.emit('moving', {direction: normalizedDirection.clone()});
        normalizedDirection = normalizedDirection.scale(Math.min(this.speed, maxDistance ?? this.speed));
        this.owner.vel.x = normalizedDirection.x;
        this.owner.vel.y = normalizedDirection.y;
    }
}