import {Actor, Rectangle} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {ChasesTargetComponent} from "../Component/ChasesTargetComponent.ts";
import {SearchesTargetComponent} from "../Component/SearchesTargetComponent.ts";
import {EnemyTag, FriendlyTag} from "./tags.ts";

const size: number = 8;

const graphic = new Rectangle({
    width: size,
    height: size,
    color: ColorPalette.accentDarkColor,
    lineWidth: 2,
    strokeColor: ColorPalette.backgroundLightColor
});

export class Monster extends Actor {
    constructor() {
        super({
            height: size,
            width: size,
        });

        this.graphics.use(graphic);

        this.addTag(EnemyTag);

        this.addComponent(new SearchesTargetComponent({
            queryTags: [FriendlyTag],
            maxDistance: 200,
        }));

        this.addComponent(new ChasesTargetComponent(() => 40));
    }
}