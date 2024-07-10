import {Coordinate} from "./Coordinate.ts";
import {Shape} from "./Shape.ts";

export class Rectangle extends Shape {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly width: number,
        public readonly height: number,
    ) {
        super();
    }

    * coordinatesAtEdge(newCoordinateInstance: boolean = false): Generator<Coordinate> {
        for (let x = this.x; x < this.x + this.width; x++) {
            yield Coordinate.create(x, this.y, newCoordinateInstance);
            yield Coordinate.create(x, this.y + this.height, newCoordinateInstance);
        }

        for (let y = this.y + 1; y < this.y + this.height - 1; y++) {
            yield Coordinate.create(this.x, y, newCoordinateInstance);
            yield Coordinate.create(this.x + this.width, y, newCoordinateInstance);
        }
    }

    * coordinatesInBounds(newCoordinateInstance: boolean = false): Generator<Coordinate> {
        for (let dX = 0; dX < this.width; dX++) {
            for (let dY = 0; dY < this.height; dY++) {
                yield Coordinate.create(this.x + dX, this.y + dY, newCoordinateInstance);
            }
        }
    }

    atEdge({x, y}: Coordinate): boolean {
        return x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1;
    }
}