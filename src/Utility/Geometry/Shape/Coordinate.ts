import {Direction} from "../Direction.ts";
import {Shape} from "./Shape.ts";

export class Coordinate extends Shape {
    private static readonly reusableCoordinate: Coordinate = new Coordinate(0, 0);

    constructor(
        public x: number,
        public y: number,
    ) {
        super();
    }

    public static create(x: number, y: number, newInstance: boolean = false): Coordinate {
        if (newInstance) {
            return new Coordinate(x, y);
        }

        this.reusableCoordinate.x = x;
        this.reusableCoordinate.y = y;

        return this.reusableCoordinate;
    }

    inDirection(direction: Direction): Coordinate {
        return new Coordinate(
            this.x + direction.dX,
            this.y + direction.dY,
        );
    }

    toString(): string {
        return `{ x:${this.x}, y:${this.y} }`;
    }
}