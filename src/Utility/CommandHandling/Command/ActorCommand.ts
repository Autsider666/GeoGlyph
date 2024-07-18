import {Actor} from "excalibur";
import {Command} from "./Command.ts";

export abstract class ActorCommand extends Command {
    constructor(protected actor: Actor | undefined = undefined) {
        super();
    }

    public bind(actor?: Actor): void {
        this.actor = actor;
    }
}