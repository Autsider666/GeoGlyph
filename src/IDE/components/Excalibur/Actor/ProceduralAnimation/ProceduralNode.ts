import {Actor, Circle, CircleCollider, Color, Raster, Vector} from "excalibur";

export class ProceduralNode extends Actor {
    private readonly nodeSizeGraphic: Raster;

    constructor(
        pos: Vector,
        private readonly distanceToTarget: number,
        radius: number,
        public target: ProceduralNode | undefined,
        graphic?: Raster
    ) {
        super({pos});


        this.nodeSizeGraphic = graphic ?? new Circle({
            radius,
            color: Color.Transparent,
            strokeColor: Color.Orange,
            lineWidth: 1,
            lineDash: [5]
        });

        this.graphics.use(this.nodeSizeGraphic);
    }

    onPreUpdate(): void {
        if (!this.target) {
            return;
        }

        const deltaDistance = this.pos.distance(this.target.pos) - this.distanceToTarget;
        if (Math.abs(deltaDistance) < 1) {
            return;
        }

        const vector = this.target.pos.sub(this.pos).normalize();

        this.pos = this.pos.add(vector.scale(deltaDistance));
    }

    setRadius(radius: number): void {
        if (this.nodeSizeGraphic instanceof Circle) {
            this.nodeSizeGraphic.radius = radius;
        } else {
            this.nodeSizeGraphic.width = radius * 2;
            this.nodeSizeGraphic.height = radius * 2;
        }
        this.collider.set(new CircleCollider({radius}));
    }
}