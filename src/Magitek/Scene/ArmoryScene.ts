import {Actor, CollisionType, Scene, Vector} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {ArmoryDummy} from "../Actor/ArmoryDummy.ts";
import {CollisionGroups} from "../Utility/CollisionGroups.ts";

export class ArmoryScene extends Scene {
    constructor(
        private readonly weapon: Actor,
        private readonly dummy: Actor,
        width: number,
        height: number,
    ) {
        super();

        const armory = new Actor({
            x: 0,
            y: 0,
            width,
            height,
            color: ColorPalette.backgroundDarkColor,
            anchor: Vector.Zero,
            collisionType: CollisionType.PreventCollision,
        });

        this.add(armory);

        const weaponPlatform = new ArmoryDummy({
            pos: new Vector(0, height / 2),
            // rotation: Math.PI / 2,
            collisionGroup: CollisionGroups.Friendly,
        });

        weaponPlatform.addChild(this.weapon);
        armory.addChild(weaponPlatform);

        this.dummy.unparent();
        armory.addChild(this.dummy);

        weaponPlatform.setTarget(this.dummy);
    }
}