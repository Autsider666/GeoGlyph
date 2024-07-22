import {Actor, Engine, Random, Vector} from "excalibur";
import {HasTargetComponent} from "../../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {RadianHelper} from "../../../Utility/RadianHelper.ts";
import {CollisionGroups} from "../../Utility/CollisionGroups.ts";
import {BulletAttributes} from "./Ammo/BulletAttributes.ts";
import {BaseMagazine} from "./Magazine/BaseMagazine.ts";

type Attributes = {
    pos?: Vector,
    bulletAttributes: BulletAttributes,
    magazine?: BaseMagazine,
}

export abstract class BaseGun extends Actor {
    private nextTriggerIn: number = 0;
    public readonly attributes: BulletAttributes; //TODO clone on get?
    private readonly random: Random = new Random();
    private magazine?: BaseMagazine;

    protected constructor({
                              pos,
                              bulletAttributes,
                              magazine,
                          }: Attributes) {
        super({
            pos,
            collisionGroup: bulletAttributes.collisionGroup ? CollisionGroups[bulletAttributes.collisionGroup] : undefined, //TODO throw error when undefined?
        });

        this.attributes = bulletAttributes;

        this.loadMagazine(magazine);
    }

    onPreUpdate(engine: Engine, delta: number): void {
        if (this.magazine?.reloadTime && this.magazine.reloadTime > 0) {
            this.magazine.reloadTime -= delta;
            return;
        }

        this.nextTriggerIn -= delta;
        if (this.nextTriggerIn > 0) {
            return;
        }

        this.nextTriggerIn = 1000 / this.attributes.rateOfFire;

        const parent = this.parent;
        const target = this.parent?.get(HasTargetComponent)?.target;
        if (!target || !(parent instanceof Actor)) {
            return;
        }

        const pos = this.globalPos;
        if (RadianHelper.canSee(target, pos, parent.rotation, this.attributes.fieldOfView, this.attributes.range) === 0) {
            return;
        }

        if (!this.magazine) {
            console.log('No magazine loaded');
            return;
        }

        const bullet = this.magazine.getBullet();
        if (!bullet) {
            console.log('No ammo, implement reloading!');
            return;
        }

        const directionVectorToTarget = target.pos.sub(pos);
        const directionVectorToMaxReach = directionVectorToTarget.normalize().scale(this.attributes.range);
        const inaccurateDirectionVector = directionVectorToMaxReach.rotate(RadianHelper.Circle / 360 * (10 * (1 - this.attributes.accuracy)) * this.random.floating(-1, 1), pos);

        engine.add(bullet.fire(pos, inaccurateDirectionVector));
    }

    public loadMagazine(magazine?: BaseMagazine): void {
        this.magazine = magazine;
        if (!this.magazine) {
            return;
        }

        this.magazine.bind(this);
        this.magazine.events.on('empty', () => {
            this.magazine?.reload();
        });
    }
}