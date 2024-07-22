import {Actor, Vector} from "excalibur";
import {HasTargetComponent} from "../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {PatrolRouteComponent} from "../../Utility/Excalibur/Movement/Component/PatrolRouteComponent.ts";

export class ArmoryDummy extends Actor {
    private speed: number = 0;

    public setTarget(target: Actor): void {
        this.addComponent(new HasTargetComponent(target), true);
    }

    public setSpeed(speed: number): void {
        this.speed = speed;
    }

    public setRoute(route: Vector[]): void {
        this.pos = route[0];

        this.addComponent(new PatrolRouteComponent(route, () => this.speed), true);
    }
}