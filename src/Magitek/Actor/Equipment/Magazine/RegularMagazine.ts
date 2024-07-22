import {BaseBullet} from "../Ammo/BaseBullet.ts";
import {BulletAttributes} from "../Ammo/BulletAttributes.ts";
import {RegularBullet} from "../Ammo/RegularBullet.ts";
import {BaseMagazine} from "./BaseMagazine.ts";

export class RegularMagazine extends BaseMagazine {
    constructor() {
        super({
            size: 60,
        });
    }

    buildBullet(attributes: BulletAttributes): BaseBullet {
        return new RegularBullet(attributes);
    }
}