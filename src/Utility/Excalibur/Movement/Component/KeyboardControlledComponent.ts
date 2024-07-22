import {Actor, EventEmitter, Keys, PreUpdateEvent} from "excalibur";
import {DirectionQueue} from "../../DirectionQueue.ts";
import {BaseMovementComponent} from "./BaseMovementComponent.ts";

type KeyEventCallback = () => void;

type KeyEvents = {
    [key in Keys]: KeyEventCallback
}


export class KeyboardControlledComponent extends BaseMovementComponent {
    private readonly directionQueue = new DirectionQueue();

    private readonly events: EventEmitter = new EventEmitter<KeyEvents>();
    private readonly keysToWatch = new Set<Keys>();

    constructor(
        getSpeed: () => number,
        keyEvents?: Map<Keys, KeyEventCallback>,
    ) {
        super(getSpeed);

        keyEvents?.forEach((callback, key) => this.onKey(key, callback));
    }

    onAdd(owner: Actor): void {
        owner.on<'preupdate'>('preupdate', ({engine}: PreUpdateEvent) => {
            this.directionQueue.update(engine);

            this.handleMovement();

            this.keysToWatch.forEach((key) => {
                if (engine.input.keyboard.wasPressed(key)) {
                    this.events.emit(key);
                }
            });
        });
    }

    onKey(key: Keys, callback: KeyEventCallback): void {
        this.events.on(key, callback);
        this.keysToWatch.add(key);
    }

    private handleMovement(): void {
        if (this.owner === undefined) {
            return;
        }

        this.owner.vel.x = 0;
        this.owner.vel.y = 0;

        this.moveInDirection(this.directionQueue.getDirection());
    }
}