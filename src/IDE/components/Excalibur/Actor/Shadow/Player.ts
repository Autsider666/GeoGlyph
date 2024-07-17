import {Actor, ActorArgs, CollisionType, Engine, Ray, RayCastHit, Vector} from "excalibur";
import {
    KeyboardControlledComponent
} from "../../../../../Utility/Excalibur/ECS/Component/Movement/KeyboardControlledComponent.ts";
import {FieldOfViewLayer} from "./FieldOfViewLayer.ts";

export class Player extends Actor {
    public direction: Vector = Vector.Zero;
    public visionRadius: number = 150;
    public falloff: number = 2 / 3;
    private readonly baseFieldOfView: number = Math.PI * 2 / 3;
    public fieldOfView: number = Math.PI * 2 / 3;
    public fieldOfViewStartAngle: number = 0;
    public fieldOfViewEndAngle: number = 0;
    public isRunning: boolean = false;

    constructor(props?: ActorArgs) {
        super({
            collisionType: CollisionType.PreventCollision,
            ...props,
        });

        this.addComponent(new KeyboardControlledComponent(25));
    }

    onPreUpdate(engine: Engine): void {
        const pointerPos = engine.input.pointers.primary.lastWorldPos;

        this.direction = pointerPos.sub(this.pos).normalize();
        const modifier = this.isRunning ? 1.5 : 1;
        const centerAngle = this.direction.toAngle();

        this.fieldOfView = this.baseFieldOfView / modifier;
        this.fieldOfViewStartAngle = centerAngle - this.fieldOfView / 2;
        if (this.fieldOfViewStartAngle < 0) {
            this.fieldOfViewStartAngle += Math.PI * 2;
        }
        this.fieldOfViewEndAngle = centerAngle + this.fieldOfView / 2;
        if (this.fieldOfViewEndAngle < 0) {
            this.fieldOfViewEndAngle += Math.PI * 2;
        }

        for (const child of engine.currentScene.actors) {
            if (child instanceof Player || child instanceof FieldOfViewLayer) {
                continue;
            }

            child.z = -10;

            const graph = child.graphics.current;
            if (graph) {
                graph.opacity = this.canSee(child);
            }
        }
    }

    public canSee(target: Actor): number {
        const directionToActor = target.pos.sub(this.pos).normalize();
        const distanceToActor = target.collider.get().rayCast(new Ray(this.pos, directionToActor), this.visionRadius)?.distance;
        if (distanceToActor === undefined) {
            return 0;
        }

        const dotProduct = directionToActor.dot(this.direction);
        if (dotProduct < 0) {
            return 0;
        }

        const dotDiff = Math.acos(dotProduct) - this.fieldOfView / 2;
        if (dotDiff < 0) {
            return 1;
        }

        if (this.rayCastAtAngle(this.fieldOfViewStartAngle, target) || this.rayCastAtAngle(this.fieldOfViewEndAngle, target)) {
            return 1;
        }

        return 1 - dotDiff * 2;
    }

    private rayCastAtAngle(angle: number, target: Actor, maxDistance: number = this.visionRadius): RayCastHit | undefined {
        const ray = new Ray(this.pos, Vector.fromAngle(angle));
        const hits = this.scene?.physics.rayCast(ray, {
            maxDistance,
            filter: hit => hit.collider.owner.id === target.id
        }) ?? [];

        return hits[0];
    }
}