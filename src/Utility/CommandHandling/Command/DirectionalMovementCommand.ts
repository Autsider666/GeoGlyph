import {DirectionQueue} from "../../Excalibur/DirectionQueue.ts";
import {MovableComponent} from "../../Excalibur/Movement/Component/MovableComponent.ts";
import {ActorCommand} from "./ActorCommand.ts";

export class DirectionalMovementCommand extends ActorCommand {
    constructor(
        private readonly directionQueue: DirectionQueue,
    ) {
        super();
    }

    execute(): void {
        const movable = this.actor?.get(MovableComponent);

        if (!movable) {
            return;
        }

        movable.move(this.directionQueue.getDirection());
    }
}