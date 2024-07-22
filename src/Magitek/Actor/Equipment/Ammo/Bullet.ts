import {Actor, Vector} from "excalibur";
import {ColorPalette} from "../../../../IDE/ColorPalette.ts";
import {HasLifetimeComponent} from "../../../../Utility/Excalibur/ECS/Component/HasLifetimeComponent.ts";
import {CollisionGroups} from "../../../Utility/CollisionGroups.ts";

export class Bullet extends Actor {
    private _hit: boolean = false;

    constructor(
        direction: Vector,
        speed: number,
        duration: number,
    ) {
        super({
            width: 1,
            height: 5,
            color: ColorPalette.accentLightColor,
            anchor: new Vector(0.5, 0),
            collisionGroup: CollisionGroups.Friendly,
        });

        this.rotation = direction.normalize().toAngle() + Math.PI / 2;
        this.graphics.opacity = 2;

        this.vel = direction.normalize().scale(speed);

        // this.addComponent(new DirectionalMovementComponent(() => speed, () => direction));
        this.addComponent(new HasLifetimeComponent(duration));
    }

    get hit(): boolean {
        return this._hit;
    }

    onCollisionStart(): void {
        this._hit = true;
        this.kill();
    }
}