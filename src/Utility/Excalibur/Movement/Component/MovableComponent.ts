import {Vector} from "excalibur";
import {BaseMovementComponent} from "./BaseMovementComponent.ts";

export class MovableComponent extends BaseMovementComponent {
    constructor(speed: number) {
        super(speed);
    }

    public move(direction: Vector): void {
        this.moveInDirection(direction);
    }
}