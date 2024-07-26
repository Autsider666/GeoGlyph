import {Actor, CircleCollider, PolygonCollider, Vector} from "excalibur";
import {RadianHelper} from "../../../Helper/RadianHelper.ts";

export class VisibilityHelper {
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
        const normalizedAngle = RadianHelper.normalizeAngle(angleToObject - rotation);

        // Calculate angle between player orientation and the edge of the circle
        const angleToEdge = Math.atan2(objectRadius, distanceToCenter);

        const minAngle = normalizedAngle - angleToEdge;
        const maxAngle = normalizedAngle + angleToEdge;

        // Normalize minAngle and maxAngle to be within [-PI, PI]
        const normalizedMinAngle = RadianHelper.normalizeAngle(minAngle);
        const normalizedMaxAngle = RadianHelper.normalizeAngle(maxAngle);

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
}