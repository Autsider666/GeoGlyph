import {Dimensions} from "./Geometry/Dimensions.ts";
import {Coordinate} from "./Geometry/Shape/Coordinate.ts";
import {Rectangle} from "./Geometry/Shape/Rectangle.ts";

export class Array2D<Item> implements Iterable<Item> {
    private readonly items: Item[];
    public readonly bounds: Rectangle;
    public readonly length: number;

    constructor(
        public readonly dimensions: Dimensions,
        defaultValue: Item,
    ) {
        this.bounds = new Rectangle(0, 0, dimensions.width, dimensions.height);
        this.length = dimensions.width * dimensions.height;
        this.items = Array<Item>(this.length).fill(defaultValue);
    }

    static generate<Item>(dimensions: Dimensions, generator: (coordinate: Coordinate) => Item): Array2D<Item> {
        const array = new Array2D<Item>(dimensions, null as Item);

        array.iterateAll((_, coordinate) => array.set(coordinate, generator(coordinate)));

        return array;
    }

    public get(coordinate: Coordinate): Item {
        this.validateCoordinate(coordinate);

        return this.items[this.toIndex(coordinate)];
    }

    public set(coordinate: Coordinate, item: Item): void {
        this.validateCoordinate(coordinate);

        this.items[this.toIndex(coordinate)] = item;
    }

    public iterateAll(callback: (item: Item, coordinate: Coordinate) => void): void {
        for (let x = 0; x < this.dimensions.width; x++) {
            for (let y = 0; y < this.dimensions.height; y++) {
                const coordinate = new Coordinate(x, y);
                callback(this.get(coordinate), coordinate);
            }
        }
    }

    [Symbol.iterator](): Iterator<Item> {
        let index: number = 0;

        return {
            next: (): IteratorResult<Item> => ({
                value: this.items[index++], done: !(index in this.items)
            })
        };
    }

    protected toIndex({x, y}: Readonly<Coordinate>): number {
        return y * this.dimensions.width + x;
    }

    protected containsCoordinate(coordinate: Readonly<Coordinate>): boolean {
        return this.toIndex(coordinate) in this.items;
    }

    protected validateCoordinate(coordinate: Readonly<Coordinate>): void {
        if (this.containsCoordinate(coordinate)) {
            return;
        }

        throw new Error('Invalid coordinate: ' + JSON.stringify(coordinate));
    }
}