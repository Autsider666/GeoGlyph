import {HasTargetComponent} from "../../../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {Action} from "../../../../Utility/Excalibur/GOAP/Action.ts";
import {AgentObject} from "../../../../Utility/Excalibur/GOAP/types.ts";

export class ObeyOrderAction extends Action<string, 'obeyOrder'> {
    private distanceFromTarget: number = Infinity;

    constructor(
        target: AgentObject,
        private readonly minDistanceFromTarget: number = 5,
    ) {
        super(
            [],
            ['obeyOrder']
        );

        this.target = target;
    }

    requiresInRange(): boolean {
        return true;
    }

    get inRange(): boolean {
        return this.target !== undefined && this.distanceFromTarget <= this.minDistanceFromTarget;
    }

    get done(): boolean {
        return this.inRange;
    }

    perform(agent: AgentObject): boolean {
        this.distanceFromTarget = this.target?.pos.distance(agent.pos) ?? Infinity;

        return this.done;
    }

    checkProceduralPreconditions(agent: AgentObject): boolean {
        this.target = agent.get(HasTargetComponent)?.target;

        throw this.target !== undefined;
    }
}