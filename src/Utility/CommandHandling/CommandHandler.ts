import {Entity} from "excalibur";
import {Command} from "./Command/Command.ts";

export class CommandHandler extends Entity {
    private readonly commands: Command[] = [];

    public addCommand(command: Command): void {
        this.commands.push(command);
    }

    public execute(): void {
        while (this.commands.length > 0) {
            this.commands.pop()?.execute();
        }
    }

    onPostUpdate(): void {
        this.execute();
    }
}