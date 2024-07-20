import {Entity, Scene, System, SystemType, TagQuery, World} from "excalibur";
import {Command} from "../../CommandHandling/Command/Command.ts";
import {DirectionalMovementCommand} from "../../CommandHandling/Command/DirectionalMovementCommand.ts";
import {CommandHandler} from "../../CommandHandling/CommandHandler.ts";
import {DirectionQueue} from "../../DirectionQueue.ts";
import {SelectedTag} from "../../ECS/Component/SelectableComponent.ts";
import {MovableComponent} from "../../Movement/Component/MovableComponent.ts";

export class DirectInputSystem extends System {
    systemType: SystemType = SystemType.Update;

    private readonly directionQueue = new DirectionQueue();
    private readonly selectedQuery: TagQuery<typeof SelectedTag>;

    private readonly movable = new Set<Entity<MovableComponent>>();

    private readonly movementCommand: Command = new DirectionalMovementCommand(this.directionQueue, this.movable);

    constructor(
        world: World,
        private readonly commandHandler: CommandHandler,
    ) {
        super();

        this.selectedQuery = world.queryTags([SelectedTag]);

        this.selectedQuery.entityAdded$.subscribe(entity => {
            if (entity.has(MovableComponent)) {
                this.movable.add(entity);
            }
        });

        this.selectedQuery.entityRemoved$.subscribe(entity => {
            this.movable.delete(entity);
        });
    }

    initialize(_: World, scene: Scene): void {
        scene.on('preupdate', ({engine}) => this.directionQueue.update(engine));
    }

    update(): void {
        this.commandHandler.addCommand(this.movementCommand);
    }

}