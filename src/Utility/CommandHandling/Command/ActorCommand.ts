import {Actor} from "excalibur";
import {Command} from "./Command.ts";

export abstract class ActorCommand extends Command {
    protected _actor: Actor | undefined;

    constructor(actor: Actor | undefined = undefined) {
        super();

        this._actor = actor;
    }

    public bind(actor?: Actor): void {
        this._actor = actor;
    }

    get actor(): Actor | undefined {
        return this._actor;
    }
}