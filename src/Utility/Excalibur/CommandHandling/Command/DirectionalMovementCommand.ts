import {Entity} from "excalibur";
import {DirectionQueue} from "../../DirectionQueue.ts";
import {MovableComponent} from "../../Movement/Component/MovableComponent.ts";
import {Command} from "./Command.ts";

export class DirectionalMovementCommand extends Command {
    constructor(
        private readonly directionQueue: DirectionQueue,
        private readonly movable: Set<Entity<MovableComponent>>,
    ) {
        super();
    }

    execute(): void {
        const direction = this.directionQueue.getDirection();
        for (const entity of this.movable) {
            entity.get(MovableComponent)?.move(direction);
        }
    }
}