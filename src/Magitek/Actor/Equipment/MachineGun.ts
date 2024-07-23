import {CollisionGroupType} from "../../Utility/CollisionGroups.ts";
import {BulletAttributes} from "./Ammo/BulletAttributes.ts";
import {BaseGun} from "./BaseGun.ts";
import {BaseMagazine} from "./Magazine/BaseMagazine.ts";

export class MachineGun extends BaseGun {
    constructor(
        collisionGroup: CollisionGroupType,
        magazine?: BaseMagazine,
    ) {
        super({
            bulletAttributes: new BulletAttributes({
                accuracy: 0.5,
                fieldOfView: Math.PI / 6,
                lifetime: 1000,
                range: 500,
                rateOfFire: 25,
                collisionGroup: collisionGroup,
            }),
            magazine,
        });
    }
}