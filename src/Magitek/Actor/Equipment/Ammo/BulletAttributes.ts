import {CollisionGroups} from "../../../Utility/CollisionGroups.ts";

type Attributes = {
    range: number,
    accuracy: number,
    lifetime: number,
    rateOfFire: number,
    fieldOfView: number,
    collisionGroup?: keyof typeof CollisionGroups
};

export class BulletAttributes {
    constructor(
        private readonly attributes: Attributes,
    ) {
    }

    public modifyRange(delta: number): void {
        this.attributes.range = Math.max(this.attributes.range + delta, 0);
    }

    public modifyAccuracy(delta: number): void {
        this.attributes.accuracy = Math.min(Math.max(this.attributes.accuracy + delta, 0), 1);
    }

    public modifyLifetime(delta: number): void {
        this.attributes.lifetime = Math.max(this.attributes.lifetime + delta, 0);
    }

    public modifyRateOfFire(delta: number): void {
        this.attributes.rateOfFire = Math.max(this.attributes.rateOfFire + delta, 0);
    }

    public modifyFieldOfView(delta: number): void {
        this.attributes.fieldOfView = Math.min(Math.max(this.attributes.fieldOfView + delta, 0), Math.PI);
    }

    get range(): number {
        return this.attributes.range;
    }

    get accuracy(): number {
        return this.attributes.accuracy;
    }

    get lifetime(): number {
        return this.attributes.lifetime;
    }

    get rateOfFire(): number {
        return this.attributes.rateOfFire;
    }

    get fieldOfView(): number {
        return this.attributes.fieldOfView;
    }

    get collisionGroup(): keyof typeof CollisionGroups | undefined {
        return this.attributes.collisionGroup;
    }
}