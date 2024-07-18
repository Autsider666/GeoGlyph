import {Vector} from "excalibur";
import {BaseMovementComponent} from "./BaseMovementComponent.ts";

export class MovableComponent extends BaseMovementComponent {
    constructor(getSpeed: () => number) {
        super(getSpeed);
    }

    public move(direction: Vector): void {
        this.moveInDirection(direction);
    }
}