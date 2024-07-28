import {Actor, CircleCollider, Collider, Vector} from "excalibur";
import {DirtyTag} from "../../../../Magitek/Actor/tags.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {DirtyComponent} from "../../ECS/Component/DirtyComponent.ts";
import {ColliderHelper} from "../../Utility/ColliderHelper.ts";

export type VisibilityEdge = {
    coordinate: Vector,
    extendable: boolean,
    object: Actor,
    angle: number,
    collider: Collider,
    colliderType: 'circle' | 'polygon' | 'composite',
    marker?: Actor,
}

export class BlockVisibilityComponent extends BaseComponent {
    private isVisible: boolean = false;
    private cachedEdges?: Vector[];
    private isCacheable: boolean = false;

    constructor(
        // private readonly tolerance: number = 0.01,
        private readonly drawWhenVisible: boolean = true,
        private calculateEdges?: (viewpoint: Actor) => Vector[],
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        // Check if custom calculation is set;
        if (this.calculateEdges !== undefined) {
            return;
        }

        const collider = owner.collider.get();
        if (collider === undefined) {
            return;
        }

        if (!owner.has(DirtyComponent)) {
            owner.addComponent(new DirtyComponent());
        }

        owner.z = 100;

        this.isCacheable = true;
        this.cachedEdges = undefined;
        if (collider instanceof CircleCollider) {
            this.isCacheable = false;
            this.calculateEdges = (viewpoint: Actor): Vector[] => ColliderHelper.getColliderPoints(collider, {viewpoint: viewpoint.pos});
        } else {
            this.calculateEdges = (): Vector[] => ColliderHelper.getColliderPoints(collider);
        }
        // } else if (collider instanceof PolygonCollider) {
        //     this.calculateEdges = (viewpoint: Actor): VisibilityEdge[] => this.calculateEdgesForPolygon(viewpoint, collider, owner);
        // } else if (collider instanceof CompositeCollider) {
        //     this.calculateEdges = (viewpoint: Actor): VisibilityEdge[] => this.calculateEdgesForComposite(viewpoint, collider, owner);
        // } else {
        //     throw new Error(`Owner uses unsupported collider type: ${collider.constructor.name}`);
        // }
    }

    public get visible(): boolean {
        return this.isVisible;
    }


    seen(): void {
        this.isVisible = true;
    }

    getEdges(viewpoint: Actor): Vector[] {
        if (!this.owner || !this.calculateEdges) {
            return [];
        }

        if (this.isCacheable && (this.cachedEdges === undefined || this.owner.hasTag(DirtyTag))) {
            this.cachedEdges = this.calculateEdges(viewpoint);
        }

        return this.cachedEdges ?? this.calculateEdges(viewpoint);
    }

    public drawIfVisible(ctx: CanvasRenderingContext2D): void {
        if (!this.isVisible || !this.drawWhenVisible) {
            return;
        }

        const collider = this.owner?.collider.get();
        if (collider === undefined) {
            console.warn('No owner with a collider available to draw');

            return;
        }

        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;

        ctx.fill(ColliderHelper.generateShapePath(collider));
    }

    // private calculateEdgesForCircle(viewpoint: Actor, collider: CircleCollider, owner: Actor): VisibilityEdge[] {
    //     const edgeCoordinates = RadianHelper.calculateTangents(
    //         viewpoint.pos,
    //         collider.center,
    //         collider.radius,
    //         (x, y) => new Vector(x, y),
    //     );
    //
    //     return edgeCoordinates
    //         .filter(edgeCoordinate => this.isEdgeVisible(viewpoint, edgeCoordinate, collider))
    //         .map(coordinate => ({
    //             coordinate,
    //             extendable: true,
    //             object: owner,
    //             collider,
    //             colliderType: "circle",
    //             angle: coordinate.sub(viewpoint.pos).toAngle(),
    //         }));
    // }
    //
    // private calculateEdgesForPolygon(viewpoint: Actor, collider: PolygonCollider, owner: Actor): VisibilityEdge[] {
    //     const visibleEdgeCoordinates = collider.getTransformedPoints()
    //         .filter(edgeCoordinate => this.isEdgeVisible(viewpoint, edgeCoordinate, collider));
    //
    //     return visibleEdgeCoordinates.map(edgeCoordinate => {
    //         const arc = RadianHelper.Circle / 360 * this.tolerance;
    //         const deltaDirections: Vector[] = [
    //             edgeCoordinate.sub(viewpoint.pos).rotate(arc, viewpoint.pos),
    //             edgeCoordinate.sub(viewpoint.pos).rotate(-arc, viewpoint.pos)
    //         ];
    //
    //         let extendable: boolean = false;
    //         const distance = viewpoint.pos.distance(edgeCoordinate);
    //         for (const direction of deltaDirections) {
    //             const hit = this.rayCast(viewpoint.pos, direction, {
    //                 maxDistance: distance + 10, //TODO is 3 good enough?
    //                 filter: hit => hit.collider.owner !== viewpoint && hit.collider.owner.has(BlockVisibilityComponent),
    //                 searchAllColliders: false,
    //             });
    //
    //             if (hit.length === 0) {
    //                 extendable = true;
    //                 break;
    //             }
    //         }
    //
    //         return {
    //             coordinate: edgeCoordinate,
    //             extendable,
    //             object: owner,
    //             collider,
    //             colliderType: 'polygon',
    //             angle: edgeCoordinate.sub(viewpoint.pos).toAngle(),
    //         };
    //     });
    // }
    //
    // private calculateEdgesForComposite(viewpoint: Actor, collider: CompositeCollider, owner: Actor): VisibilityEdge[] {
    //     const visibleEdgeCoordinates = ColliderHelper.getCompositeColliderPoints(collider)
    //         .filter(edgeCoordinate => this.isEdgeVisible(viewpoint, edgeCoordinate, collider));
    //
    //     return visibleEdgeCoordinates.map(edgeCoordinate => { //TODO copy pasted, seems to work
    //         const arc = RadianHelper.Circle / 360 * this.tolerance;
    //         const deltaDirections: Vector[] = [
    //             edgeCoordinate.sub(viewpoint.pos).rotate(arc, viewpoint.pos),
    //             edgeCoordinate.sub(viewpoint.pos).rotate(-arc, viewpoint.pos)
    //         ];
    //
    //         let extendable: boolean = false;
    //         const distance = viewpoint.pos.distance(edgeCoordinate);
    //         for (const direction of deltaDirections) {
    //             const hit = this.rayCast(viewpoint.pos, direction, {
    //                 maxDistance: distance * 3, //TODO is 3 good enough?
    //                 filter: hit => hit.collider.owner !== viewpoint && hit.collider.owner.has(BlockVisibilityComponent),
    //                 searchAllColliders: true,
    //             });
    //
    //             if (hit.length === 0) {
    //                 extendable = true;
    //                 break;
    //             }
    //         }
    //
    //         return {
    //             coordinate: edgeCoordinate,
    //             extendable,
    //             object: owner,
    //             collider,
    //             colliderType: 'composite',
    //             angle: edgeCoordinate.sub(viewpoint.pos).toAngle(),
    //         };
    //     });
    // }
    //
    // private isEdgeVisible(viewpoint: Actor, edgeCoordinate: Vector, collider: Collider): boolean {
    //     const distance = edgeCoordinate.distance(viewpoint.pos);
    //     const hit = this.rayCastTo(viewpoint.pos, edgeCoordinate, {
    //         filter: hit => hit.collider.owner !== viewpoint && hit.collider.owner.has(BlockVisibilityComponent),
    //         maxDistance: distance + this.tolerance,
    //         searchAllColliders: true,
    //     })[0];
    //
    //     if (!hit) {
    //         return true;
    //     }
    //
    //     if (hit.distance > 1000) {
    //         console.warn('Hit distance is too big?', hit);
    //     }
    //
    //     if (hit.collider !== collider && hit.collider.composite !== collider) {
    //         return false; // TODO communicate this?
    //     }
    //
    //     return Math.abs(distance - hit.distance) <= this.tolerance;
    // }
}