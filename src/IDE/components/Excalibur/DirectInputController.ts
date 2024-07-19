import {Actor, Engine, Entity} from "excalibur";
import {DirectionalMovementCommand} from "../../../Utility/CommandHandling/Command/DirectionalMovementCommand.ts";
import {CommandHandler} from "../../../Utility/CommandHandling/CommandHandler.ts";
import {DirectionQueue} from "../../../Utility/Excalibur/DirectionQueue.ts";
import {SelectedTag} from "../../../Utility/Excalibur/ECS/Component/SelectableComponent.ts";

export class DirectInputController extends Entity {
    private readonly directionQueue = new DirectionQueue();
    private readonly movementCommand: DirectionalMovementCommand = new DirectionalMovementCommand(this.directionQueue);

    constructor(
        private readonly commandHandler: CommandHandler,
    ) {
        super();
    }

    onPreUpdate(engine: Engine): void {
        this.directionQueue.update(engine);

        if (this.movementCommand.actor?.hasTag(SelectedTag) !== true) {
            return;
        }

        this.commandHandler.addCommand(this.movementCommand);
    }

    setActor(actor?: Actor): void {
        this.movementCommand.bind(actor);
    }
}