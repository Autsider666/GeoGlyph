export class Direction {
    static none: Direction = new Direction(0, 0);
    static north: Direction = new Direction(0, -1);
    static northEast: Direction = new Direction(1, -1);
    static east: Direction = new Direction(1, 0);
    static southEast: Direction = new Direction(1, 1);
    static south: Direction = new Direction(0, 1);
    static southWest: Direction = new Direction(-1, 1);
    static west: Direction = new Direction(-1, 0);
    static northWest: Direction = new Direction(-1, -1);

    static all = [
        Direction.north,
        Direction.northEast,
        Direction.east,
        Direction.southEast,
        Direction.south,
        Direction.southWest,
        Direction.west,
        Direction.northWest,
    ] as const;

    static cardinal = [
        Direction.north,
        Direction.east,
        Direction.south,
        Direction.west,
    ] as const;

    static ordinal = [
        Direction.northEast,
        Direction.southEast,
        Direction.southWest,
        Direction.northWest,
    ] as const;

    constructor(
        public readonly dX: number,
        public readonly dY: number,
    ) {
    }

    toString():string {
        return `dX:${this.dX}, dY:${this.dY}`;
    }
}