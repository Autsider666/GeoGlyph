import {Action} from "./Action.ts";
import {Goal} from "./types.ts";

export interface GoapInterface<WorldState = unknown> {
    getWorldState(): WorldState;

    createGoalState(): Goal;

    planFailed(goal: Goal): void;

    planFound(goal: Goal, actions: Goal): void; //TODO actions a goal?

    planFinished(): void;

    planAborted(failedAction: Action): void;

    moveAgent(action: Action): boolean;
}