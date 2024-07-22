import {Actor, Vector} from "excalibur";
import {PreUpdateListeningComponent} from "../../ECS/PreUpdateListeningComponent.ts";

export class PatrolRouteComponent extends PreUpdateListeningComponent {
    private currentTarget!: Vector;

    constructor(
        private readonly route: Vector[],
        private readonly getSpeed: () => number,
    ) {
        super();

        if (route.length < 2) {
            throw new Error('Provided route is too short');
        }
    }

    onAdd(owner: Actor): void {
        super.onAdd(owner);

        this.setTarget(this.route[0]);
    }

    onPreUpdate(): void {
        const owner = this.owner;
        if (!owner) {
            return;
        }

        owner.vel = this.currentTarget.sub(owner.pos).normalize().scale(this.getSpeed());

        if (owner.pos.distance(this.currentTarget) > 1) {
            return;
        }

        const nextIndex = this.route.indexOf(this.currentTarget) + 1;
        this.setTarget(this.route[nextIndex === this.route.length ? 0 : nextIndex]);
    }

    private setTarget(target: Vector): void {
        const owner = this.owner;
        if (!owner) {
            return;
        }

        this.currentTarget = target;

        owner.vel = target.sub(owner.pos).normalize().scale(this.getSpeed());

        // this.moveInDirection(, this.getSpeed());
    }
}