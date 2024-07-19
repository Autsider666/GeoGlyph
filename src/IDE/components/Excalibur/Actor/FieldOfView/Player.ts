import {Actor, ActorArgs, CollisionType, Engine, Keys, Vector} from "excalibur";
import {AngularInertiaComponent} from "../../../../../Utility/Excalibur/ECS/Component/AngularInertiaComponent.ts";
import {SelectableComponent} from "../../../../../Utility/Excalibur/ECS/Component/SelectableComponent.ts";
import {MovableComponent} from "../../../../../Utility/Excalibur/Movement/Component/MovableComponent.ts";
import {ViewpointComponent} from "../../../../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {RadianHelper} from "../../../../../Utility/RadianHelper.ts";

export class Player extends Actor {
    private direction: Vector = Vector.Zero;
    private visionRadius: number = 250;
    private fieldOfView: number = RadianHelper.Circle / 3;

    public isRunning: boolean = false;

    // Stats
    private speed: number = 50;

    constructor(props?: ActorArgs) {
        super({
            collisionType: CollisionType.PreventCollision,
            ...props,
        });

        this.addComponent(new AngularInertiaComponent(() => 200 * (this.isRunning ? 2 : 1)));
        this.addComponent(new MovableComponent(() => this.speed * (this.isRunning ? 3 : 1)));
        this.addComponent(new ViewpointComponent([
            {
                getAngle: (): number => RadianHelper.Circle / 3 * (this.isRunning ? 1.5 : 1),
                getRange: (): number => 250 / (this.isRunning ? 1.5 : 1),
            }, {
                getRange: (): number => (props?.radius ?? props?.width ?? props?.height ?? 0) * 3,
                getFalloff: (): number => 0.75,
            }
        ]));

        this.addComponent(new SelectableComponent());
    }

    onInitialize(engine: Engine): void {
        engine.inputMapper.on(({keyboard}) => keyboard.wasPressed(Keys.ShiftLeft), () => this.isRunning = true);
        engine.inputMapper.on(({keyboard}) => keyboard.wasReleased(Keys.ShiftLeft), () => this.isRunning = false);
    }

    // onPreUpdate(engine: Engine): void {
    //     const pointerPos = engine.input.pointers.primary.lastWorldPos;
    //
    //     this.direction = pointerPos.sub(this.pos).normalize();
    //     const modifier = this.isRunning ? 1.5 : 1;
    //     const centerAngle = this.direction.toAngle();
    //
    //     this.fieldOfView = this.baseFieldOfView / modifier;
    //     this.fieldOfViewStartAngle = centerAngle - this.fieldOfView / 2;
    //     if (this.fieldOfViewStartAngle < 0) {
    //         this.fieldOfViewStartAngle += RadianHelper.Circle;
    //     }
    //     this.fieldOfViewEndAngle = centerAngle + this.fieldOfView / 2;
    //     if (this.fieldOfViewEndAngle < 0) {
    //         this.fieldOfViewEndAngle += RadianHelper.Circle;
    //     }
    //
    //     // for (const child of engine.currentScene.actors) {
    //     //     if (child instanceof Player || child instanceof VisibilityLayer || child === this.firstTangent || child === this.secondTangent) {
    //     //         continue;
    //     //     }
    //     //
    //     //     child.z = -10;
    //     //
    //     //     const graph = child.graphics.current;
    //     //     if (graph) {
    //     //         graph.opacity = this.canSee(child);
    //     //     }
    //     // }
    // }

    // Works well for eyes (or turrets?) following a target
    private calculateTangents(viewPoint: Vector, centerCircle: Vector, radiusCircle: number, maxDistance: number): [Vector, Vector] | [Vector] | undefined {
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

    normalizeAngle(angle: number): number {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle <= -Math.PI) angle += 2 * Math.PI;
        return angle;
    }

    public canSee(target: Actor): number {
        const objectRadius = target.collider.get().radius; //FIXME this only works for CircleCollider

        // Calculate vector from player to object center
        const dx = target.pos.x - this.pos.x;
        const dy = target.pos.y - this.pos.y;

        // Calculate distance from player to object center
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

        // Check if object center is within max range
        if (distanceToCenter > this.visionRadius + objectRadius) {
            return 0; // Object is outside max range
        }

        // Calculate angle between player's orientation and the object center
        const angleToObject = Math.atan2(dy, dx);

        // Normalize the angle to be within [-PI, PI]
        const normalizedAngle = this.normalizeAngle(angleToObject - this.direction.toAngle());

        // Calculate half-angle of the field of view
        const halfFOV = this.fieldOfView / 2;

        // Calculate angle between player orientation and the edge of the circle
        const angleToEdge = Math.atan2(objectRadius, distanceToCenter);

        const minAngle = normalizedAngle - angleToEdge;
        const maxAngle = normalizedAngle + angleToEdge;

        // Normalize minAngle and maxAngle to be within [-PI, PI]
        const normalizedMinAngle = this.normalizeAngle(minAngle);
        const normalizedMaxAngle = this.normalizeAngle(maxAngle);

        // Calculate visible angle range
        const visibleAngleRange = Math.min(normalizedMaxAngle, halfFOV) - Math.max(normalizedMinAngle, -halfFOV);

        // Check if target is outside of field of view
        if (visibleAngleRange < 0) {
            return 0;
        }

        // Calculate percentage of circle visible in terms of surface area
        const circleArea = Math.PI * objectRadius * objectRadius;

        const visibleFraction = visibleAngleRange / this.fieldOfView;
        const visibleArea = visibleFraction * circleArea;
        const visiblePercentage = visibleArea / circleArea;

        // if (visiblePercentage < 0) {
        //     return 0;
        // }
        //
        // const tangents = this.calculateTangents(this.pos, target.pos, objectRadius, this.visionRadius);
        // if (tangents) {
        //     const [first, second] = tangents;
        //
        //     this.scene?.add(this.firstTangent);
        //     this.firstTangent.pos = first;
        //
        //     const targetCollider = target.collider.get();
        //
        //     if (!targetCollider.contains(first)) {
        //         const direction = target.center.sub(first);
        //         const ray = new Ray(first, direction);
        //
        //         const hit = targetCollider.rayCast(ray);
        //
        //         const data: Record<string, unknown> = {tangent: first};
        //         if (hit) {
        //             data.hit = hit;
        //             data.hitCoordinate = hit.point;
        //             data.differenceBetweenCoordinate = hit.point.distance(first);
        //             data.isHitCoordinateInCollider = targetCollider.contains(hit.point);
        //         }
        //
        //         const pointCollider = new EdgeCollider({
        //             begin: first,
        //             end: target.pos,
        //         });
        //
        //         data.closestLine = targetCollider.getClosestLineBetween(pointCollider);
        //
        //
        //         console.log(data);
        //     }
        //
        //     if (second) {
        //         this.secondTangent.pos = second;
        //         this.scene?.add(this.secondTangent);
        //     }
        // }

        // Clamp percentage to range [0, 1]
        return Math.max(0, Math.min(1, visiblePercentage * 10));
    }
}