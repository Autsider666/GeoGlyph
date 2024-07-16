import {Engine, Keys, Vector} from "excalibur";
import {Direction} from "../Geometry/Direction.ts";

export class DirectionQueue {
    private heldDirections: Direction[] = [];
    private readonly direction: Vector = new Vector(0, 0);

    getDirection(): Vector {
        return this.direction;
    }

    has(direction: Direction): boolean {
        return this.heldDirections.includes(direction);
    }

    add(direction: Direction): void {
        const exists = this.heldDirections.includes(direction);
        if (exists) {
            return;
        }
        this.heldDirections.unshift(direction);
    }

    remove(direction: Direction): void {
        this.heldDirections = this.heldDirections.filter((d) => d !== direction);
    }

    update(engine: Engine): void {
        [
            {key: Keys.Left, dir: Direction.west},
            {key: Keys.A, dir: Direction.west},
            {key: Keys.Right, dir: Direction.east},
            {key: Keys.D, dir: Direction.east},
            {key: Keys.Up, dir: Direction.north},
            {key: Keys.W, dir: Direction.north},
            {key: Keys.Down, dir: Direction.south},
            {key: Keys.S, dir: Direction.south},
        ].forEach((group) => {
            if (engine.input.keyboard.wasPressed(group.key)) {
                this.add(group.dir);
            }
            if (engine.input.keyboard.wasReleased(group.key)) {
                this.remove(group.dir);
            }

            let dX: number = 0;
            let dY: number = 0;
            for (const heldDirection of this.heldDirections) {
                dX += heldDirection.dX;
                dY += heldDirection.dY;
            }

            this.direction.setTo(dX, dY);
        });
    }
}