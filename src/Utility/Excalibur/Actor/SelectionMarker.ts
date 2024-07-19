import {Actor, Circle, Color, Engine} from "excalibur";
import {ParentIndependentAngle} from "../Rotation/Component/ParentIndipendantAngle.ts";

type SelectionCircleAttributes = {
    color?: Color,
    radius?: number,
    width?: number,
    dashes?: number[],
    animationGrowth?: number,
    animationSpeed?: number,
}

export class SelectionMarker extends Actor {
    private readonly graphic: Circle;
    private readonly autoFit: boolean;
    private readonly baseWidth: number;

    // Animation
    private readonly animationGrowth?: number;
    private readonly animationSpeed: number;
    private animationShrinking: boolean = false;

    constructor({
                    color = Color.Red,
                    radius,
                    width = 2,
                    dashes,
                    animationGrowth,
                    animationSpeed = 1,
                }: SelectionCircleAttributes = {}) {
        super();

        this.autoFit = radius === undefined;
        this.baseWidth = width;
        this.animationGrowth = animationGrowth;
        this.animationSpeed = animationSpeed;

        this.graphic = new Circle({
            radius: radius ?? 0,
            color: Color.Transparent,
            strokeColor: color,
            lineWidth: width,
            lineDash: dashes,
            lineCap: 'round',
        });

        this.graphics.use(this.graphic);

        this.z = 100;

        this.addComponent(new ParentIndependentAngle());
    }

    onPostUpdate(_: Engine, delta: number): void {
        if (!this.parent || !(this.parent instanceof Actor)) {
            return;
        }

        this.encompass(this.parent);

        this.animate(delta);
    }

    private encompass(actor: Actor): void {
        if (!this.autoFit) {
            return;
        }

        const bounds = actor.collider.get().localBounds.getPoints();
        let maxDistance: number = 0;
        for (const parentBound of bounds) {
            const distance = parentBound.distance(this.pos);
            maxDistance = Math.max(maxDistance, distance);
        }

        this.graphic.radius = maxDistance + 5;
    }

    private animate(delta: number): void {
        if (this.animationGrowth === undefined || this.baseWidth === undefined) {
            return;
        }

        const duration: number = 1000 / this.animationSpeed;

        const deltaValue: number = this.animationGrowth / duration * delta * (this.animationShrinking ? -1 : 1);
        // const value: number = this.graphic.radius;
        const value: number = this.graphic.lineWidth;
        const minValue: number = 1;
        const maxValue: number = 1 + this.animationGrowth;

        const newValue: number = Math.max(Math.min(value + deltaValue, maxValue), minValue);


        if (newValue >= maxValue) {
            this.animationShrinking = true;
        } else if (newValue <= minValue) {
            this.animationShrinking = false;
        }

        // this.graphic.radius = newValue;
        this.graphic.lineWidth = newValue;
    }
}