import {Actor, Color, Rectangle} from "excalibur";
import {ChasesTargetComponent} from "../Component/ChasesTargetComponent.ts";
import {SearchesTargetComponent} from "../Component/SearchesTargetComponent.ts";
import {EnemyTag, FriendlyTag} from "./tags.ts";

const graphic = new Rectangle({
    width: 8,
    height: 8,
    color: Color.ExcaliburBlue
});

export class Monster extends Actor {
    constructor() {
        super();

        this.graphics.use(graphic);

        this.addTag(EnemyTag);

        this.addComponent(new SearchesTargetComponent({
            queryTags: [FriendlyTag],
            maxDistance: 200,
        }));

        this.addComponent(new ChasesTargetComponent(() => 40));
    }
}