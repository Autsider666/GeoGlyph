import {AgentObject} from "./types.ts";

export abstract class Action<Precondition extends string = string, Effect extends string = string> {
    protected preconditions: Set<Precondition>;
    protected effects: Set<Effect>;
    public target?: AgentObject | undefined;

    constructor(preconditions: Precondition[] = [], effects: Effect[] = []) {
        this.preconditions = new Set<Precondition>(preconditions);
        this.effects = new Set<Effect>(effects);
    }

    abstract get done(): boolean; // Or isDone?

    public get inRange(): boolean {
        return !this.requiresInRange();
    }

    public get cost(): number {
        return 1;
    }

    public requiresInRange(): boolean {
        return false; //TODO or true?
    }

    public reset(): void {
        this.target = undefined;
    }

    abstract perform(agent: AgentObject): boolean;

    abstract checkProceduralPreconditions(agent: AgentObject): boolean;
}