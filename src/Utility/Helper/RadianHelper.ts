import {Vector} from "excalibur";
import {GenericVector} from "../Type/Coordinate.ts";

export class RadianHelper {
    static readonly Circle: number = Math.PI * 2;

    public static normalizeAngle(angle: number): number {
        while (angle > Math.PI) {
            angle -= 2 * Math.PI;
        }

        while (angle <= -Math.PI) {
            angle += 2 * Math.PI;
        }

        return angle;
    }

    public static orderClockwise(center: Vector, points: Vector[]): Vector[] {
        return points.sort((a, b): number => {
            const angleA = a.sub(center).toAngle();
            const angleB = b.sub(center).toAngle();

            if (angleA === angleB) {
                return 0;
            }

            return angleA < angleB ? -1 : 1;
        });
    }

    // Works well for eyes (or turrets?) following a target
    public static calculateTangents<Coordinate extends GenericVector = GenericVector>(
        viewPoint: Coordinate,
        centerCircle: Coordinate,
        radiusCircle: number,
        coordinateBuilder: (x: number, y: number) => Coordinate,
        maxDistance?: number,
    ): Coordinate[] {
        const {x, y} = viewPoint;

        const dx = x - centerCircle.x;
        const dy = y - centerCircle.y;
        const dr2 = dx * dx + dy * dy;

        if (dr2 <= radiusCircle * radiusCircle) {
            return []; // Viewpoint is inside or on the circle
        }

        const D = Math.sqrt(dr2 - radiusCircle * radiusCircle);
        const a = radiusCircle * radiusCircle / dr2;
        const b = radiusCircle * D / dr2;

        // Calculate tangent points
        const tangent1: Coordinate = coordinateBuilder(a * dx + b * dy + centerCircle.x, a * dy - b * dx + centerCircle.y);
        const tangent2: Coordinate = coordinateBuilder(a * dx - b * dy + centerCircle.x, a * dy + b * dx + centerCircle.y);

        // Check if tangents are within maxDistance from viewpoint
        const distToTangent1 = Math.sqrt((tangent1.x - x) * (tangent1.x - x) + (tangent1.y - y) * (tangent1.y - y));
        const distToTangent2 = Math.sqrt((tangent2.x - x) * (tangent2.x - x) + (tangent2.y - y) * (tangent2.y - y));

        const validTangents: Coordinate[] = [];
        if (maxDistance === undefined || distToTangent1 <= maxDistance) {
            validTangents.push(tangent1);
        }

        if (maxDistance === undefined || distToTangent2 <= maxDistance) {
            validTangents.push(tangent2);
        }

        return validTangents;
    }
}