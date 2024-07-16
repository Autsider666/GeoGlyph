import {Actor, Canvas, Circle, Color, Vector} from "excalibur";

type GraphicMode = 'node' | 'size' | 'full'

export class ProceduralNode extends Actor {
    private readonly nodeGraphic: Circle;
    private readonly nodeSizeGraphic: Circle;
    private readonly fullGraphic: Canvas;

    constructor(
        pos: Vector,
        private readonly distanceToTarget: number,
        private radius: number,
        public target: ProceduralNode | undefined,
    ) {
        super({pos});

        this.nodeGraphic = new Circle({
            radius: 5,
            color: Color.Black,
            strokeColor: Color.Orange,
            lineWidth: 1,
        });

        this.nodeSizeGraphic = new Circle({
            radius,
            color: Color.Transparent,
            strokeColor: Color.Orange,
            lineWidth: 1,
            lineDash: [5]
        });

        this.fullGraphic = new Canvas({
            width: distanceToTarget * 3,
            height: distanceToTarget * 3,
            cache: true,
            draw: (ctx): void => {
                console.log(this.radius, ctx);
            }
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

        // console.log(this.globalPos.sub(this.target.globalPos).normalize().scale(this.radius));
        //
        // this.pos.add(this.globalPos.sub(this.target.globalPos).normalize().scale(this.radius),this.pos);
    }

    setRadius(radius: number): void {
        this.nodeSizeGraphic.radius = radius;
        this.radius = radius;
        this.fullGraphic.flagDirty();
    }

    setMode(mode: GraphicMode): void {
        switch (mode) {
            case "node":
                this.graphics.use(this.nodeGraphic);
                break;
            case "size":
                this.graphics.use(this.nodeSizeGraphic);
                break;
            case "full":
                this.graphics.use(this.fullGraphic);
                break;

        }
    }
}