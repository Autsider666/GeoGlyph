import {
    Actor,
    ActorArgs,
    BoundingBox,
    CompositeCollider,
    EdgeCollider,
    Polygon,
    PolygonCollider,
    PolygonOptions,
    RasterOptions,
    Scene,
    Vector,
} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {DirtyComponent} from "../../Utility/Excalibur/ECS/Component/DirtyComponent.ts";
import {
    PointerClickToPositionComponent
} from "../../Utility/Excalibur/ECS/Component/PointerClickToPositionComponent.ts";
import {KeyboardControlledComponent} from "../../Utility/Excalibur/Movement/Component/KeyboardControlledComponent.ts";
import {FogLayer} from "../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {BlockVisibilityComponent} from "../../Utility/Excalibur/Visibility/Component/BlockVisibilityComponent.ts";
import {ViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {VisibilitySystem} from "../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {Machina} from "../Actor/Machina.ts";
import {EnemyVisibilitySystem} from "../System/EnemyVisibilitySystem.ts";

type PolygonActorArgs = ActorArgs & PolygonOptions & RasterOptions & { angle?: number }

function createPolygonActor(config: PolygonActorArgs): Actor {
    const collider = new PolygonCollider({
        points: config.points,
    }).triangulate();

    const actor = new Actor({
        ...config,
        // @ts-expect-error weird IDE
        collider,
        rotation: 0,
    });

    actor.graphics.use(new Polygon({
        ...config,
    }));

    if (config.angle) {
        actor.rotation = config.angle;
    }

    return actor;
}


const objects: Actor[] = [
    //TOP LEFT
    new Actor({
        name: 'Top Left',
        pos: new Vector(300, 400),
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
        anchor: Vector.Zero,
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
        pos: new Vector(600, 300),
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
        anchor: Vector.Zero,
    }),
    //TOP RIGHT
    new Actor({
        name: 'Top Right',
        pos: new Vector(700, 400),
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
        anchor: Vector.Zero,
    }),
    //BOTTOM LEFT
    new Actor({
        name: 'Bottom Left',
        pos: new Vector(350, 700),
        width: 50,
        height: 300,
        color: ColorPalette.accentDarkColor,
        anchor: Vector.Zero,
    }),
    // //BOTTOM RIGHT
    // new Actor({
    //     name: 'Bottom Right',
    //     x: 450,
    //     y: 425,
    //     radius: 100,
    //     color: ColorPalette.accentLightColor,
    // }),
    createPolygonActor({
        name: 'Polygon Bottom Right',
        pos: new Vector(600, 600),
        points: [
            new Vector(-100, -100),
            new Vector(0, -50),
            new Vector(100, -100),
            new Vector(50, 50),
            new Vector(-100, 100),
            new Vector(-50, 50),
        ],
        color: ColorPalette.accentLightColor,
        // rotation: Math.PI / 3,
        angle: -Math.PI / 3,
    }),
    createPolygonActor({
        name: 'Polygon Bottom Right',
        pos: new Vector(800, 700),
        points: [
            new Vector(-100, -100),
            new Vector(0, -50),
            new Vector(100, -100),
            new Vector(50, 50),
            new Vector(-100, 100),
            new Vector(-50, 50),
        ],
        color: ColorPalette.accentLightColor,
        // rotation: Math.PI,
    }),
    createPolygonActor({
        name: 'Polygon Bottom Right',
        pos: new Vector(500, 600),
        points: [
            new Vector(-100, -100),
            new Vector(0, -50),
            new Vector(100, -100),
            new Vector(50, 50),
            new Vector(-100, 100),
            new Vector(-50, 50),
        ],
        color: ColorPalette.accentLightColor,
    }),
];

export class ExperimentalScene extends Scene {
    onInitialize(): void {
        this.backgroundColor = ColorPalette.backgroundDarkColor;
        this.world.add(VisibilitySystem);
        this.world.add(EnemyVisibilitySystem);
    }

    onActivate(): void {
        const worldBounds = BoundingBox.fromDimension(
            1000, 1000,
            Vector.Zero,
            // Vector.Zero,
        );

        this.add(new FogLayer(worldBounds, {
            // alpha: 0.75,
            // color: 'white',
        }));
        // this.add(new ShadowLayer(worldBounds));

        // const viewPoint = this.createViewPoint(
        //     'Player',
        //     // new Vector(180, 400), // Weird position right between square an polygon
        //     // new Vector(665, 600),
        //     worldBounds.center,
        //     100,
        //     false,
        // );
        const viewPoint = new Machina(worldBounds.center, 50);
        viewPoint.addComponent(new KeyboardControlledComponent(() => 100));
        viewPoint.addComponent(new DirtyComponent());
        this.add(viewPoint);

        this.add(this.createViewPoint('Monster', new Vector(100, 100), undefined, true));
        this.add(this.createViewPoint('Ally Top', worldBounds.center.sub(new Vector(0, 100)), undefined, false));
        this.add(this.createViewPoint('Ally Left', worldBounds.center.sub(new Vector(100, -100)), undefined, false));

        for (const object of objects) {
            object.addComponent(new BlockVisibilityComponent());
            this.add(object);
        }

        this.camera.strategy.lockToActor(viewPoint);
        this.camera.strategy.limitCameraBounds(worldBounds);

        this.createOuterBoundsCollider(worldBounds);
    }

    private createViewPoint(name: string, position: Vector, speed: number | undefined, hideViewPoint: boolean): Actor {
        const viewPoint = new Actor({
            name,
            pos: position,
            radius: 10,
            color: ColorPalette.accentLightColor,
        });
        const viewPoints = [
            // {
            //     getRange: (): number => 10,
            //     getFalloff: (): number => 1, //0.75
            // },
            {
                getRange: (): number => 150, // 150, //250
                getFalloff: (): number => 0, //0.75
            },
            {
                getAngle: (): number => Math.PI,
                getRange: (): number => 250,
                getFalloff: (): number => 0, //0.75
            },
        ];

        viewPoint.rotation = -Math.PI / 2;

        if (speed !== undefined) {
            viewPoint.addComponent(new PointerClickToPositionComponent());
            viewPoint.addComponent(new KeyboardControlledComponent(() => speed));
        }

        viewPoint.addComponent(new ViewpointComponent(viewPoints, hideViewPoint));

        return viewPoint;
    }

    private createOuterBoundsCollider(bounds: BoundingBox): void {
        const collider = new CompositeCollider([
            new EdgeCollider({
                begin: bounds.topLeft,
                end: new Vector(bounds.width, 0),
            }), // North
            new EdgeCollider({
                begin: bounds.topRight,
                end: new Vector(bounds.width, bounds.height)
            }), // East
            new EdgeCollider({
                begin: bounds.bottomLeft,
                end: new Vector(bounds.width, bounds.height)
            }), // South
            new EdgeCollider({
                begin: bounds.topLeft,
                end: new Vector(0, bounds.height),
            }), // West
        ]);

        this.engine.add(new Actor({
            name: 'Screen collider',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            collider,
        }).addComponent(new BlockVisibilityComponent(false)));
    }
}