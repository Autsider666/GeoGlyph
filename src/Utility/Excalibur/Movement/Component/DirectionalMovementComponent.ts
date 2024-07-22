import {PreUpdateEvent, Vector} from "excalibur";
import {PreUpdateListeningComponent} from "../../ECS/PreUpdateListeningComponent.ts";

export class DirectionalMovementComponent extends PreUpdateListeningComponent {
    constructor(
        private readonly getSpeed: () => number,
        private readonly getDirection: () => Vector,
    ) {
        super();
    }

    onPreUpdate({delta}: PreUpdateEvent): void {
        this.moveInDirection(this.getDirection(), this.getSpeed() * delta);
    }
}