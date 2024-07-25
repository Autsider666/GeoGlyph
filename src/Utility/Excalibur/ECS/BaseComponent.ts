import {Actor, Component, Ray, RayCastHit, RayCastOptions, Vector} from "excalibur";

export abstract class BaseComponent extends Component {
    declare owner?: Actor;

    onAdd?(owner: Actor): void;

    onRemove?(previousOwner: Actor): void;

    protected moveInDirection(direction: Vector, speed?: number, maxDistance?: number): void {
        if (this.owner === undefined) {
            return;
        }

        if (direction.x === 0 && direction.y === 0) {
            this.owner.vel.x = direction.x;
            this.owner.vel.y = direction.y;
            return;
        }

        if (speed !== undefined || maxDistance !== undefined) {
            direction = direction.normalize();
            if (speed !== undefined) {
                direction = direction.scale(Math.min(speed, maxDistance ?? speed));
            }
        }

        this.owner.vel.x = direction.x;
        this.owner.vel.y = direction.y;
    }

    protected rayCast(position: Vector, direction: Vector, options?: RayCastOptions): RayCastHit[] {
        const physics = this.owner?.scene?.physics;
        if (!physics) {
            throw new Error('Can\'t rayCast without physics.');
        }

        return physics.rayCast(
            new Ray(position, direction),
            options,
        );
    }

    protected rayCastTo(position: Vector, target: Vector, options?: RayCastOptions): RayCastHit[] {
        return this.rayCast(position, target.sub(position), options);
    }
}