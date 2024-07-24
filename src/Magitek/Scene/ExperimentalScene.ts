import {Actor, Color, CompositeCollider, CoordPlane, EdgeCollider, Ray, Scene, Vector} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {KeyboardControlledComponent} from "../../Utility/Excalibur/Movement/Component/KeyboardControlledComponent.ts";
import {FogLayer} from "../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {NewViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/NewViewpointComponent.ts";
import {ViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {VisibilitySystem} from "../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {BlocksVisibilityTag} from "../Actor/tags.ts";
import {EnemyVisibilitySystem} from "../System/EnemyVisibilitySystem.ts";
import {CollisionGroups} from "../Utility/CollisionGroups.ts";

const objects: Actor[] = [
    //TOP LEFT
    new Actor({
        name: 'Top Left',
        x: 200,
        y: 200,
        width: 100,
        height: 100,
        color: Color.Green,
        coordPlane: CoordPlane.Screen
    }),
    //TOP Center
    // new Actor({
    //     name: 'Top Center',
    //     x: 450,
    //     y: 0,
    //     radius: 200,
    //     color: Color.Blue,
    // }),
    new Actor({
        name: 'Top Center',
        x: 400,
        y: 100,
        width: 100,
        height: 100,
        color: Color.Green,
    }),
    //TOP RIGHT
    new Actor({
        name: 'Top Right',
        x: 500,
        y: 200,
        width: 100,
        height: 100,
        color: Color.Green,
    }),
    //BOTTOM LEFT
    new Actor({
        name: 'Bottom Left',
        x: 100,
        y: 450,
        width: 100,
        height: 100,
        color: Color.Green,
    }),
    //BOTTOM RIGHT
    // new Actor({
    //     name: 'Bottom Right',
    //     x: 450,
    //     y: 425,
    //     radius: 100,
    //     color: Color.Blue,
    // }),
];

export class ExperimentalScene extends Scene {
    onInitialize(): void {
        this.backgroundColor = ColorPalette.backgroundDarkColor;
        this.world.add(VisibilitySystem);
        this.world.add(EnemyVisibilitySystem);
    }

    onActivate(): void {
        this.world.add(new FogLayer({
            alpha: 0,
            // color: 'white',
        }));
        // this.world.add(new ShadowLayer());

        const viewPoint = new Actor({
            x: 300,
            y: 300,
            radius: 10,
            color: ColorPalette.accentLightColor,
        });
        const viewPoints = [
            // {
            //     getAngle: (): number => Math.PI,
            //     getRange: (): number => 1000,
            // },
            {
                getRange: (): number => 500, //250
                getFalloff: (): number => 0.9999, //0.75
            }
        ];

        viewPoint.addComponent(new ViewpointComponent(viewPoints));
        viewPoint.addComponent(new NewViewpointComponent(viewPoints));
        viewPoint.addComponent(new KeyboardControlledComponent(() => 50));

        this.add(viewPoint);

        for (const object of objects) {
            object.addTag(BlocksVisibilityTag);
            this.add(object);
        }

        // this.camera.strategy.lockToActor(viewPoint);

        // const width = 1;
        // this.createScreenWall(bounds.topLeft, bounds.topRight, width);
        // this.createScreenWall(bounds.topRight, bounds.bottomRight, width);
        // this.createScreenWall(bounds.bottomLeft, bounds.bottomRight, width);
        // this.createScreenWall(bounds.topLeft, bounds.bottomLeft, width);

        // this.createScreenWalls(100, true);
        this.createScreenCollider();


        const test = this.engine.currentScene.physics.rayCast(
            new Ray(viewPoint.pos, new Vector(700,600).sub(viewPoint.pos)), //new Vector(1, 1)
            {
                filter: hit => hit.collider.owner !== viewPoint
            }
        );
        console.log(test, test[0].collider,test[0].collider.bounds, test[0].collider.composite?.bounds);
    }

    private createScreenWall(begin: Vector, end: Vector, width: number): void {
        const isHorizontal = begin.y === end.y;
        if (isHorizontal && begin.x >= end.x) {
            throw new Error('begin is not on the left of end.');
        }

        if (!isHorizontal && begin.y >= end.y) {
            throw new Error('begin is not above end.');
        }

        const length = end.distance(begin);
        const screenWall = new Actor({
            pos: begin,
            width: isHorizontal ? length : width,
            height: !isHorizontal ? length : width,
            anchor: isHorizontal ? new Vector(0, 0.5) : new Vector(0.5, 0),
            coordPlane: CoordPlane.Screen,
            color: Color.White,
            collisionGroup: CollisionGroups.Neutral,
        });

        screenWall.addTag(BlocksVisibilityTag);
        this.engine.add(screenWall);
    }

    private createScreenWalls(thickness: number = 1, visible: boolean = false): void {
        const bounds = this.engine.screen.getScreenBounds();

        const effectiveThickness = visible ? thickness : thickness * 0.5;

        //North
        this.engine.add(new Actor({
            pos: bounds.topLeft,
            width: bounds.width - effectiveThickness,
            height: thickness,
            anchor: new Vector(0, visible ? 0 : 0.5),
            coordPlane: CoordPlane.Screen,
            color: Color.White, //TODO remove
            collisionGroup: CollisionGroups.Neutral,
        }).addTag(BlocksVisibilityTag));

        //East
        this.engine.add(new Actor({
            pos: bounds.topRight,
            width: thickness,
            height: bounds.height - effectiveThickness,
            anchor: new Vector(visible ? 1 : 0.5, 0),
            coordPlane: CoordPlane.Screen,
            color: Color.White, //TODO remove
            collisionGroup: CollisionGroups.Neutral,
        }).addTag(BlocksVisibilityTag));

        //South
        this.engine.add(new Actor({
            pos: bounds.bottomRight,
            width: bounds.width - effectiveThickness,
            height: thickness,
            anchor: new Vector(1, visible ? 1 : 0.5),
            coordPlane: CoordPlane.Screen,
            color: Color.White, //TODO remove
            collisionGroup: CollisionGroups.Neutral,
        }).addTag(BlocksVisibilityTag));

        //West
        this.engine.add(new Actor({
            pos: bounds.bottomLeft,
            width: thickness,
            height: bounds.height - effectiveThickness,
            anchor: new Vector(visible ? 0 : 0.5, 1),
            coordPlane: CoordPlane.Screen,
            color: Color.White, //TODO remove
            collisionGroup: CollisionGroups.Neutral,
        }).addTag(BlocksVisibilityTag));
    }

    private createScreenCollider(): void {
        const screenBounds = this.engine.screen.getScreenBounds();
        const collider = new CompositeCollider([
            new EdgeCollider({begin: new Vector(0, 0), end: new Vector(screenBounds.width, 0)}), // North
            new EdgeCollider({begin: new Vector(screenBounds.width, 0), end: new Vector(screenBounds.width, screenBounds.height)}), // East
            new EdgeCollider({begin: new Vector(0, screenBounds.height), end: new Vector(screenBounds.width, screenBounds.height)}), // South
            new EdgeCollider({begin: new Vector(0, 0), end: new Vector(0, screenBounds.height)}), // West
        ]);

        console.log(collider.bounds);

        this.engine.add(new Actor({
            name: 'Screen collider',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            collider,
        }).addTag(BlocksVisibilityTag));
    }
}