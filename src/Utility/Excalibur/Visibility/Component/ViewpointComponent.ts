import {Actor, CircleCollider, PolygonCollider, Vector} from "excalibur";
import {RadianHelper} from "../../../Helper/RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";

type ViewPointData = {
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}

export class ViewpointComponent extends BaseComponent implements ViewPoint {
    private static defaultAngle: number = RadianHelper.Circle;
    private static defaultRange: number = Infinity;
    private static defaultFalloff: number = 0;

    constructor(
        private readonly viewPoints: ViewPointData[]
    ) {
        super();
    }

    drawViewPoint(ctx: CanvasRenderingContext2D): void {
        const owner = this.owner;
        if (!owner) {
            console.warn('Skipped drawing because of lack of owner');
            return;
        }

        const pos = owner.pos;
        const centerX = pos.x;
        const centerY = pos.y;
        const direction = owner.rotation;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;

        for (const {
            getAngle = (): number => ViewpointComponent.defaultAngle,
            getRange = (): number => ViewpointComponent.defaultRange,
            getFalloff = (): number => ViewpointComponent.defaultFalloff,
        } of this.viewPoints) {
            const angle = getAngle();
            const startAngle = direction - angle / 2;
            const endAngle = direction + angle / 2;


            const range = getRange();
            ctx.fillStyle = this.posToGradient(
                ctx,
                pos,
                range,
                'rgba(0,0,0,0)',
                'rgba(0,0,0,1)',
                getFalloff()
            );

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(
                centerX,
                centerY,
                range,
                startAngle,
                endAngle,
            );

            ctx.closePath();
            ctx.fill();
        }
    }

    protected posToGradient(
        ctx: CanvasRenderingContext2D,
        pos: Vector,
        visionRadius: number,
        lightColor: string,
        darkColor: string,
        falloff: number,
    ): CanvasGradient {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, visionRadius, pos.x, pos.y, visionRadius * falloff);
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(1, darkColor);

        return gradient;
    }

    public canSee(target: Actor): number {
        const owner = this.owner;
        if (!owner) {
            return 0;
        }

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
        const dx = target.pos.x - owner.pos.x;
        const dy = target.pos.y - owner.pos.y;

        // Calculate distance from player to object center
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

        // Calculate angle between player's orientation and the object center
        const angleToObject = Math.atan2(dy, dx);

        // Normalize the angle to be within [-PI, PI]
        const normalizedAngle = this.normalizeAngle(angleToObject - owner.rotation);

        // Calculate angle between player orientation and the edge of the circle
        const angleToEdge = Math.atan2(objectRadius, distanceToCenter);

        const minAngle = normalizedAngle - angleToEdge;
        const maxAngle = normalizedAngle + angleToEdge;

        // Normalize minAngle and maxAngle to be within [-PI, PI]
        const normalizedMinAngle = this.normalizeAngle(minAngle);
        const normalizedMaxAngle = this.normalizeAngle(maxAngle);

        let maxVisibility: number = 0;
        for (const {
            getAngle = (): number => ViewpointComponent.defaultAngle,
            getRange = (): number => ViewpointComponent.defaultRange,
        } of this.viewPoints) {
            // Check if object center is within max range
            if (distanceToCenter > getRange() + objectRadius) {
                continue; // Object is outside max range
            }

            const FOV = getAngle();

            // Calculate half-angle of the field of view
            const halfFOV = FOV / 2;

            // Calculate visible angle range
            const visibleAngleRange = Math.min(normalizedMaxAngle, halfFOV) - Math.max(normalizedMinAngle, -halfFOV);

            // Check if target is outside of field of view
            if (visibleAngleRange < 0) {
                continue;
            }

            const visibleFraction = visibleAngleRange / FOV;
            const visibleArea = visibleFraction * objectArea;
            const visiblePercentage = visibleArea / objectArea;

            maxVisibility = Math.max(maxVisibility, visiblePercentage);
        }

        // Clamp percentage to range [0, 1]
        return Math.max(0, Math.min(1, maxVisibility * 10));
    }

    private normalizeAngle(angle: number): number {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle <= -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
}