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
            CanvasHelper.drawPolygon(ctx, ColliderHelper.getUniqueCompositePoints(collider));
        } else {
            throw new Error('Unimplemented Collider type: ' + collider.constructor.name);
        }
    }

    public static getUniqueCompositePoints(collider: CompositeCollider): Vector[] {
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