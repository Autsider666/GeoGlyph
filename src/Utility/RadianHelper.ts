import {Actor, CircleCollider, PolygonCollider, Vector} from "excalibur";

export class RadianHelper {
    static readonly Circle: number = Math.PI * 2;

    public static canSee(target: Actor, position: Vector, rotation: number, fieldOfView: number, range: number): number {
        let objectRadius: number | undefined;
        let objectArea: number | undefined;
        const collider = target.collider.get();
        if (collider === undefined) {
            // console.log('Undefined collider on:', target);
            return 1;
        }

        if (collider instanceof CircleCollider) {
            objectRadius = collider.radius;
            objectArea = Math.PI * objectRadius * objectRadius;
        } else if (collider instanceof PolygonCollider) {
            objectRadius = (collider.bounds.height + collider.bounds.height) / 4;
            objectArea = collider.bounds.height * collider.bounds.height;
        } else {
            console.error(collider);
            throw new Error('Unknown collider type');
        }

        // Calculate vector from player to object center
        const dx = target.globalPos.x - position.x;
        const dy = target.globalPos.y - position.y;

        // Calculate distance from player to object center
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

        // Calculate angle between player's orientation and the object center
        const angleToObject = Math.atan2(dy, dx);

        // Normalize the angle to be within [-PI, PI]
        const normalizedAngle = this.normalizeAngle(angleToObject - rotation);

        // Calculate angle between player orientation and the edge of the circle
        const angleToEdge = Math.atan2(objectRadius, distanceToCenter);

        const minAngle = normalizedAngle - angleToEdge;
        const maxAngle = normalizedAngle + angleToEdge;

        // Normalize minAngle and maxAngle to be within [-PI, PI]
        const normalizedMinAngle = this.normalizeAngle(minAngle);
        const normalizedMaxAngle = this.normalizeAngle(maxAngle);

        let maxVisibility: number = 0;
        // Check if object center is within max range
        if (distanceToCenter > range + objectRadius) {
            return 0; // Object is outside max range
        }

        // Calculate half-angle of the field of view
        const halfFOV = fieldOfView / 2;

        // Calculate visible angle range
        const visibleAngleRange = Math.min(normalizedMaxAngle, halfFOV) - Math.max(normalizedMinAngle, -halfFOV);

        // Check if target is outside of field of view
        if (visibleAngleRange < 0) {
            return 0;
        }

        const visibleFraction = visibleAngleRange / fieldOfView;
        const visibleArea = visibleFraction * objectArea;
        const visiblePercentage = visibleArea / objectArea;

        maxVisibility = Math.max(maxVisibility, visiblePercentage);

        // Clamp percentage to range [0, 1]
        return Math.max(0, Math.min(1, maxVisibility * 10));
    }

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
    public static calculateTangents(viewPoint: Vector, centerCircle: Vector, radiusCircle: number, maxDistance: number): [Vector, Vector] | [Vector] | undefined {
        const {x, y} = viewPoint;

        const dx = x - centerCircle.x;
        const dy = y - centerCircle.y;
        const dr2 = dx * dx + dy * dy;

        if (dr2 <= radiusCircle * radiusCircle) {
            return undefined; // Viewpoint is inside or on the circle
        }

        const D = Math.sqrt(dr2 - radiusCircle * radiusCircle);
        const a = radiusCircle * radiusCircle / dr2;
        const b = radiusCircle * D / dr2;

        // Calculate tangent points
        const tangent1 = new Vector(a * dx + b * dy + centerCircle.x, a * dy - b * dx + centerCircle.y);
        const tangent2 = new Vector(a * dx - b * dy + centerCircle.x, a * dy + b * dx + centerCircle.y);

        // Check if tangents are within maxDistance from viewpoint
        const distToTangent1 = Math.sqrt((tangent1.x - x) * (tangent1.x - x) + (tangent1.y - y) * (tangent1.y - y));
        const distToTangent2 = Math.sqrt((tangent2.x - x) * (tangent2.x - x) + (tangent2.y - y) * (tangent2.y - y));

        if (distToTangent1 <= maxDistance && distToTangent2 <= maxDistance) {
            return [tangent1, tangent2];
        } else if (distToTangent1 <= maxDistance) {
            return [tangent1];
        } else if (distToTangent2 <= maxDistance) {
            return [tangent2];
        } else {
            return undefined; // No valid tangents within maxDistance
        }
    }
}