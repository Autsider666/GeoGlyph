import {Actor, Subscription} from "excalibur";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {Action} from "../Action.ts";
import {Agent} from "../Agent.ts";
import {GoapInterface} from "../GoapInterface.ts";
import {Planner} from "../Planner.ts";

export class GoapAgentComponent extends BaseComponent {
    private agent: Agent | undefined;
    private subscription: Subscription | undefined;

    constructor(
        private readonly actions: Action[],
        private readonly dataProvider: GoapInterface,
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        this.agent = new Agent(
            owner,
            this.actions,
            new Planner(),
            this.dataProvider,
        );

        this.subscription = owner.on('preupdate', () => {
            this.agent?.update();
        });
    }

    onRemove(): void {
        this.agent = undefined;
        this.subscription?.close();
    }
}