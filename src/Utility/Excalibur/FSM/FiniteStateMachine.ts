export type State<StateTarget> = (param: FiniteStateMachine<StateTarget>, target: StateTarget) => void;

export class FiniteStateMachine<StateTarget> {
    private readonly stateStack: State<StateTarget>[] = [];

    constructor(private readonly fallbackState?: StateTarget) {
    }

    public update(target: StateTarget): void {
        const state = this.stateStack[0];
        if (state) {
            state(this, target);
        } else if (this.fallbackState !== undefined) {
            // @ts-expect-error IDE again
            this.fallbackState(this, target);
        }
    }

    public pushState(state: State<StateTarget>): void {
        this.stateStack.push(state);
    }

    public popState(): void {
        this.stateStack.pop();
    }
}