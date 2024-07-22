import {Actor, Collider, Entity, Vector} from "excalibur";
import {ColorPalette} from "../../../../IDE/ColorPalette.ts";
import {HasLifetimeComponent} from "../../../../Utility/Excalibur/ECS/Component/HasLifetimeComponent.ts";
import {CollisionGroups} from "../../../Utility/CollisionGroups.ts";
import {BulletAttributes} from "./BulletAttributes.ts";

export abstract class BaseBullet extends Actor {
    private _hit?: Entity;

    constructor(private readonly attributes: BulletAttributes) {
        super({
            width: 1,
            height: 5,
            color: ColorPalette.accentLightColor,
            anchor: new Vector(0.5, 0),
            collisionGroup: attributes.collisionGroup ? CollisionGroups[attributes.collisionGroup] : undefined, //TODO throw error if no group?
        });

        this.graphics.opacity = 2;

        this.addComponent(new HasLifetimeComponent(this.attributes.lifetime));
    }

    fire(position: Vector, direction: Vector): this {
        this.pos = position;
        this.rotation = direction.normalize().toAngle() + Math.PI / 2;
        this.vel = direction.normalize().scale(this.attributes.range / this.attributes.lifetime * 1000);

        this.get(HasLifetimeComponent).reset(this.attributes.lifetime);

        this._hit = undefined;

        return this;
    }

    get hit(): Entity | undefined {
        return this._hit;
    }

    onCollisionStart(_: Collider, other: Collider): void {
        this._hit = other.owner;
        this.kill();
    }
}