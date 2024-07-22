import {CollisionGroupManager} from "excalibur";
import {EnemyTag, FriendlyTag} from "../Actor/tags.ts";

export class CollisionGroups {
    static readonly Friendly = CollisionGroupManager.create(FriendlyTag);
    static readonly Enemy = CollisionGroupManager.create(EnemyTag);
}