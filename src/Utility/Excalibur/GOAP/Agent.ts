import {Queue} from "../../Queue.ts";
import {FiniteStateMachine} from "../FSM/FiniteStateMachine.ts";
import {State} from "../FSM/State.ts";
import {Action} from "./Action.ts";
import {GoapInterface} from "./GoapInterface.ts";
import {Planner} from "./Planner.ts";
import {AgentObject} from "./types.ts";

export class Agent {
    private readonly stateMachine: FiniteStateMachine = new FiniteStateMachine();
    private readonly idleState: State;
    private readonly moveToState: State;
    private readonly performActionState: State;

    private readonly availableActions: Set<Action>;
    private currentActions: Queue<Action> = new Queue<Action>();

    constructor(
        private readonly agentObject: AgentObject,
        availableActions: Action[],
        private readonly planner: Planner,
        private readonly dataProvider: GoapInterface,
    ) {
        this.availableActions = new Set<Action>(availableActions);

        this.idleState = this.createIdleState();
        this.moveToState = this.createMoveToState();
        this.performActionState = this.createPerformActionState();

        this.stateMachine.pushState(this.idleState);
    }

    public update(): void {
        this.stateMachine.update(this.agentObject);
    }

    public addAction(action: Action): void {
        this.availableActions.add(action);
    }

    public removeAction(action: Action): void {
        this.availableActions.delete(action);
    }

    private createIdleState(): State {
        return (stateMachine: FiniteStateMachine, agent: AgentObject) => {
            const worldState = this.dataProvider.getWorldState();
            const goal = this.dataProvider.createGoalState();

            const plan: Queue<Action> | undefined = this.planner.plan(agent, this.availableActions, worldState, goal);
            if (plan !== undefined) {
                this.currentActions = plan;
                this.dataProvider.planFound(goal, plan);

                stateMachine.popState();
                stateMachine.pushState(this.performActionState);
            } else {
                this.dataProvider.planFailed(goal);
            }
        };
    }

    private createMoveToState(): State {
        return (stateMachine: FiniteStateMachine) => {
            const action = this.currentActions.peek();
            if (!action) {
                stateMachine.popState();
                stateMachine.pushState(this.idleState);
                return;
            }

            if (action.requiresInRange() && action.target === undefined) {
                stateMachine.popState();
                stateMachine.pushState(this.idleState);
            }

            if (this.dataProvider.moveAgent(action)) {
                stateMachine.popState();
            }
        };
    }

    private createPerformActionState(): State {
        return (stateMachine: FiniteStateMachine, agent: AgentObject) => {
            let action = this.currentActions.peek();
            if (action && action.done) {
                this.currentActions.dequeue();
                action = this.currentActions.peek();
            }

            if (!action) {
                stateMachine.popState();
                stateMachine.pushState(this.idleState);
                this.dataProvider.planFinished();
                return;
            }

            if (action.inRange) {
                const success: boolean = action.perform(agent);
                if (success) {
                    return;
                }

                stateMachine.popState();
                stateMachine.pushState(this.idleState);
                this.dataProvider.planAborted(action);
            } else {
                stateMachine.pushState(this.moveToState);
            }
        };
    }
}