import {Actor, Circle, Collider, Color, Graphic, Polygon, Rectangle, Shape, Vector} from "excalibur";
import {NeutralTag} from "../../../Magitek/Actor/tags.ts";
import {MinTuple} from "../../Type/Tuple.ts";
import {BlockVisibilityComponent} from "../Visibility/Component/BlockVisibilityComponent.ts";

type ObjectArgs = {
    name?: string,
    pos?: Vector,
    anchor?: Vector,
    rotation?: number,
    collider?: Collider,
    graphic?: Graphic,
    drawWhenVisible?:boolean,
}

type GraphicArgs = {
    color?: Color,
    strokeColor?: Color,
    lineWidth?: number,
}

type CircleArgs = Omit<ObjectArgs & GraphicArgs & { radius: number }, 'graphic' | 'collider'>
type RectangleArgs = Omit<ObjectArgs & GraphicArgs & { width: number, height: number }, 'graphic' | 'collider'>
type PolygonArgs = Omit<ObjectArgs & GraphicArgs & { points: MinTuple<3, Vector> }, 'graphic' | 'collider'>

export class EnvironmentObject extends Actor {
    constructor(args: ObjectArgs) {
        super({
            name: args.name,
            pos: args.pos,
            anchor: args.anchor,
            rotation: args.rotation,
            collider: args.collider,
        });

        if (args.graphic) {
            this.graphics.add(args.graphic, {anchor: args.anchor,});
        }

        this.addComponent(new BlockVisibilityComponent(args.drawWhenVisible));

        this.addTag(NeutralTag);
    }

    public static Circular(args: CircleArgs): EnvironmentObject {
        const {radius} = args;

        return new EnvironmentObject({
            name: args.name,
            pos: args.pos,
            anchor: args.anchor,
            rotation: args.rotation,
            collider: Shape.Circle(radius),
            graphic: new Circle({
                ...args,
                // @ts-expect-error Bug in EX
                rotation: 0,
            }),
        });
    }

    public static Rectangular(args: RectangleArgs): EnvironmentObject {
        const {width, height, anchor} = args;

        return new EnvironmentObject({
            name: args.name,
            pos: args.pos,
            anchor: args.anchor,
            rotation: args.rotation,
            collider: Shape.Box(width, height, anchor),
            graphic: new Rectangle({
                ...args,
                // @ts-expect-error Bug in EX
                rotation: 0,
            }),
        });
    }

    public static Polygonal(args: PolygonArgs): EnvironmentObject {
        const {points} = args;

        return new EnvironmentObject({
            ...args,
            collider: Shape.Polygon(points),
            graphic: new Polygon({
                ...args,
                // @ts-expect-error Bug in EX
                rotation: 0,
            }),
        });
    }
}