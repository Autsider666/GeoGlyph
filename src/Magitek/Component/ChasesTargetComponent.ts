import {HasTargetComponent} from "../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {PreUpdateListeningComponent} from "../../Utility/Excalibur/ECS/PreUpdateListeningComponent.ts";

export class ChasesTargetComponent extends PreUpdateListeningComponent {
    constructor(
        private readonly getSpeed: () => number, //TODO add min distance?
    ) {
        super();
    }

    onPreUpdate(): void {
        const target = this.owner?.get(HasTargetComponent)?.target;
        if (!target || !this.owner) {
            return;
        }

        this.moveInDirection(target.pos.sub(this.owner?.pos), this.getSpeed());
    }

}