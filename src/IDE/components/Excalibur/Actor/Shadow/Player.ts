import {Actor, Engine, Keys, Ray, RayCastHit, Vector} from "excalibur";

export type PlayerViewCone = { pos: Vector, radius: number, startAngle: number, endAngle: number };

export class Player extends Actor {
    public direction: Vector = Vector.Zero;
    public visionRadius: number = 150;
    public fieldOfView: number = Math.PI * 2 / 3;
    public fieldOfViewStartAngle: number = 0;
    public fieldOfViewEndAngle: number = 0;
    public isRunning: boolean = false;
    public hasMoved: boolean = false;

    onInitialize(engine: Engine): void {
        const speed: number = 1;
        engine.inputMapper.on(
            ({keyboard}) => keyboard.isHeld(Keys.W),
            () => {
                this.hasMoved = true;
                this.pos.add(new Vector(0, -speed * (this.isRunning ? 2 : 1)), this.pos);
            },
        );
        engine.inputMapper.on(
            ({keyboard}) => keyboard.isHeld(Keys.S),
            () => {
                this.hasMoved = true;
                this.pos.add(new Vector(0, speed * (this.isRunning ? 2 : 1)), this.pos);
            },
        );
        engine.inputMapper.on(
            ({keyboard}) => keyboard.isHeld(Keys.A),
            () => {
                this.hasMoved = true;
                this.pos.add(new Vector(-speed * (this.isRunning ? 2 : 1), 0), this.pos);
            },
        );
        engine.inputMapper.on(
            ({keyboard}) => keyboard.isHeld(Keys.D),
            () => {
                this.hasMoved = true;
                this.pos.add(new Vector(speed * (this.isRunning ? 2 : 1), 0), this.pos);
            },
        );
        engine.inputMapper.on(
            ({keyboard}) => keyboard.isHeld(Keys.ShiftLeft),
            () => this.isRunning = true,
        );
        engine.inputMapper.on(
            ({keyboard}) => keyboard.wasReleased(Keys.ShiftLeft),
            () => this.isRunning = false,
        );
    }

    onPreUpdate(engine: Engine): void {
        const pointerPos = engine.input.pointers.primary.lastWorldPos;

        const modifier = this.isRunning && this.hasMoved ? 1.5 : 1;
        this.direction = pointerPos.sub(this.pos).normalize();
        const centerAngle = this.direction.toAngle();
        this.fieldOfViewStartAngle = centerAngle - this.fieldOfView / 2 / modifier;
        if (this.fieldOfViewStartAngle < 0) {
            this.fieldOfViewStartAngle += Math.PI * 2;
        }
        this.fieldOfViewEndAngle = centerAngle + this.fieldOfView / 2 / modifier;
        if (this.fieldOfViewEndAngle < 0) {
            this.fieldOfViewEndAngle += Math.PI * 2;
        }

        this.hasMoved = false;

        // console.log({start: this.fieldOfViewStartAngle, end: this.fieldOfViewEndAngle});
    }

    public getViewCone(): PlayerViewCone {
        return {
            pos: this.pos.clone(),
            radius: this.visionRadius,
            startAngle: this.fieldOfViewStartAngle,
            endAngle: this.fieldOfViewEndAngle,
        };
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