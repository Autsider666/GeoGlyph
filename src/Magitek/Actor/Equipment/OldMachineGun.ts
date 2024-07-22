import {Actor, Engine, Random, Vector} from "excalibur";
import {HasTargetComponent} from "../../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {RadianHelper} from "../../../Utility/RadianHelper.ts";
import {CollisionGroups} from "../../Utility/CollisionGroups.ts";
import {Bullet} from "./Ammo/Bullet.ts";

export class OldMachineGun extends Actor {
    private nextBulletIn: number = 0;
    private readonly random: Random = new Random();

    constructor(
        public readonly deltaPos: Vector = Vector.Zero,
        public readonly fieldOfView: number = Math.PI / 6,
        public readonly maxRange: number = 300,
        public readonly secondsToMaxRange: number = 1,
        public readonly accuracy: number = 0.5,
        public readonly ratePerSecond: number = 25,
    ) {
        super({
            // width: 10,
            // height: 3,
            // color: Color.Black,
            // anchor: new Vector(0.5, 0)
            collisionGroup: CollisionGroups.Friendly,
        });

        this.pos = deltaPos;
    }

    onPreUpdate(engine: Engine, delta: number): void {
        this.nextBulletIn -= delta;
        if (this.nextBulletIn > 0) {
            return;
        }

        this.nextBulletIn = 1000 / this.ratePerSecond;

        const parent = this.parent;
        const target = this.parent?.get(HasTargetComponent)?.target;
        if (!target || !(parent instanceof Actor)) {
            return;
        }

        const pos = this.globalPos;
        if (RadianHelper.canSee(target, pos, parent.rotation, this.fieldOfView, this.maxRange) === 0) {
            return;
        }

        const directionVectorToTarget = target.pos.sub(pos);
        const directionVectorToMaxReach = directionVectorToTarget.normalize().scale(this.maxRange);
        const inaccurateDirectionVector = directionVectorToMaxReach.rotate(RadianHelper.Circle / 360 * (10 * (1 - this.accuracy)) * this.random.floating(-1, 1), pos);

        const bullet = new Bullet(inaccurateDirectionVector, this.maxRange / this.secondsToMaxRange, this.secondsToMaxRange * 1000);
        bullet.pos = pos;
        engine.add(bullet);
    }
}