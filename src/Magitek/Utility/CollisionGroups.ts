import {CollisionGroup, CollisionGroupManager} from "excalibur";
import {EnemyTag, FriendlyTag} from "../Actor/tags.ts";

export const CollisionGroups = {
    Friendly: CollisionGroupManager.create(FriendlyTag),
    Enemy: CollisionGroupManager.create(EnemyTag),
} as const satisfies Record<string, CollisionGroup>;