import {CollisionGroup, CollisionGroupManager} from "excalibur";
import {EnemyTag, FriendlyTag} from "../Actor/tags.ts";

export type CollisionGroupType = keyof typeof CollisionGroups;

export const CollisionGroups = {
    Friendly: CollisionGroupManager.create(FriendlyTag),
    Enemy: CollisionGroupManager.create(EnemyTag),
} as const satisfies Record<string, CollisionGroup>;