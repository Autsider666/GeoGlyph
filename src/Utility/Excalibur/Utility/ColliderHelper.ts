import {CircleCollider, Collider, CompositeCollider, EdgeCollider, PolygonCollider, Vector} from "excalibur";
import {CanvasHelper} from "../../Helper/CanvasHelper.ts";
import {CoordinateHelper} from "../../Helper/CoordinateHelper.ts";
import {RadianHelper} from "../../Helper/RadianHelper.ts";

export class ColliderHelper {
    public static drawShape(ctx: CanvasRenderingContext2D, collider: Collider): void {
        if (collider instanceof CircleCollider) {
            ctx.arc(
                collider.center.x,
                collider.center.y,
                collider.radius,
                0,
                RadianHelper.Circle,
            );
            ctx.fill();
        } else if (collider instanceof PolygonCollider) {
            CanvasHelper.drawPolygon(ctx, collider.bounds.getPoints());
        } else if (collider instanceof CompositeCollider) {
            CanvasHelper.drawPolygon(ctx, ColliderHelper.getCompositeColliderPoints(collider));
        } else {
            throw new Error('Unimplemented Collider type: ' + collider.constructor.name);
        }
    }

    public static getColliderPoints(
        collider: Collider | undefined,
        {viewpoint}: { viewpoint?: Vector } = {},
    ): Vector[] {
        if (collider === undefined) {
            return [];
        }

        if (collider instanceof CircleCollider) {
            if (!viewpoint) {
                return [];
            }

            return this.getCircleColliderPoints(collider, viewpoint);
        }

        if (collider instanceof PolygonCollider) {
            return this.getPolygonColliderPoints(collider);
        }

        if (collider instanceof EdgeCollider) {
            return this.getEdgeColliderPoints(collider);
        }

        if (collider instanceof CompositeCollider) {
            //FIXME replace with getCompositeColliderPoints
            const points: Vector[] = [];
            for (const compositeCollider of collider.getColliders()) {
                points.push(...this.getColliderPoints(compositeCollider));
            }

            return CoordinateHelper.getUniqueCoordinates<Vector>(points);
        }

        throw new Error(`Collider "${collider.constructor.name}" is not implemented yet.`);
    }

    public static getEdgeColliderPoints(collider:EdgeCollider):Vector[] {
        return [
            collider.begin,
            collider.end,
        ];
    }

    public static getPolygonColliderPoints(collider: PolygonCollider): Vector[] {
        // TODO add convex check
        return collider.getTransformedPoints();
    }

    public static getCircleColliderPoints(collider: CircleCollider, viewpoint: Vector): Vector[] {
        return RadianHelper.calculateTangents(
            viewpoint,
            collider.center,
            collider.radius,
            (x, y) => new Vector(x, y),
        );
    }

    public static getCompositeColliderPoints(collider: CompositeCollider): Vector[] {
        const edges: Vector[] = [];
        for (const compositeCollider of collider.getColliders()) {
            if (compositeCollider instanceof EdgeCollider) {
                edges.push(compositeCollider.begin);
                edges.push(compositeCollider.end);
            } else if (compositeCollider instanceof PolygonCollider) {
                edges.push(...compositeCollider.getTransformedPoints());
            } else {
                throw new Error('Collider not implemented yey: ' + collider.constructor.name);
            }
        }

        return CoordinateHelper.getUniqueCoordinates<Vector>(edges);
    }
}