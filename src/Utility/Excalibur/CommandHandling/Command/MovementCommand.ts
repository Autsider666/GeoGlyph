import {Actor, Vector} from "excalibur";
import {Command} from "./Command.ts";

export class MovementCommand extends Command {
    constructor(
        private readonly actor: Actor,
        private readonly direction: Vector,
    ) {
        super();
    }

    execute(): void {
        this.actor.vel.x = this.direction.x;
        this.actor.vel.y = this.direction.y;
    }
}