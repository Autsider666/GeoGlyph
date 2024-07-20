import {Actor} from "excalibur";
import {State} from "./State.ts";

export class FiniteStateMachine {
    private readonly stateStack: State[] = [];

    public update(actor: Actor): void {
        const state = this.stateStack[0];
        if (state) {
            state(this, actor);
        }
    }

    public pushState(state: State): void {
        this.stateStack.push(state);
    }

    public popState(): void {
        this.stateStack.pop();
    }
}