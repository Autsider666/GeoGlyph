import {
    Actor,
    ActorArgs,
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
import {
    PointerClickToPositionComponent
} from "../../Utility/Excalibur/ECS/Component/PointerClickToPositionComponent.ts";
import {KeyboardControlledComponent} from "../../Utility/Excalibur/Movement/Component/KeyboardControlledComponent.ts";
import {FogLayer} from "../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {ShadowLayer} from "../../Utility/Excalibur/Visibility/Actor/ShadowLayer.ts";
import {BlockVisibilityComponent} from "../../Utility/Excalibur/Visibility/Component/BlockVisibilityComponent.ts";
import {NewViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/NewViewpointComponent.ts";
import {ViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {VisibilitySystem} from "../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
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
        x: 200,
        y: 200,
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
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
        color: ColorPalette.accentDarkColor,
    }),
    //TOP RIGHT
    new Actor({
        name: 'Top Right',
        x: 500,
        y: 200,
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
    }),
    //BOTTOM LEFT
    new Actor({
        name: 'Bottom Left',
        x: 100,
        y: 450,
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
        pos: new Vector(350, 350),
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
        pos: new Vector(550, 450),
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
        pos: new Vector(250, 350),
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
        this.world.add(new FogLayer({
            alpha: 0.9,
            // color: 'white',
        }));
        this.world.add(new ShadowLayer());

        const viewPoint = this.createViewPoint(
            'Player',
            // new Vector(180, 400), // Weird position right between square an polygon
            new Vector(165, 100),
            // x: 165, //300
            // y: 100, //300
        );
        this.add(viewPoint);

        for (const object of objects) {
            object.addComponent(new BlockVisibilityComponent());
            this.add(object);
        }

        // this.camera.strategy.lockToActor(viewPoint);

        this.createScreenCollider();
    }

    private createViewPoint(name: string, position: Vector): Actor {
        const viewPoint = new Actor({
            name,
            pos: position,
            radius: 10,
            color: ColorPalette.accentLightColor,
        });
        const viewPoints = [
            // {
            //     getAngle: (): number => Math.PI,
            //     getRange: (): number => 1000,
            // },
            {
                getRange: (): number => 150, // 150, //250
                getFalloff: (): number => 0, //0.75
            }
        ];

        viewPoint.addComponent(new PointerClickToPositionComponent());
        viewPoint.addComponent(new ViewpointComponent(viewPoints));
        viewPoint.addComponent(new NewViewpointComponent(viewPoints));
        viewPoint.addComponent(new KeyboardControlledComponent(() => 100));

        return viewPoint;
    }

    private createScreenCollider(): void {
        const screenBounds = this.engine.screen.getScreenBounds();
        const collider = new CompositeCollider([
            new EdgeCollider({begin: new Vector(0, 0), end: new Vector(screenBounds.width, 0)}), // North
            new EdgeCollider({
                begin: new Vector(screenBounds.width, 0),
                end: new Vector(screenBounds.width, screenBounds.height)
            }), // East
            new EdgeCollider({
                begin: new Vector(0, screenBounds.height),
                end: new Vector(screenBounds.width, screenBounds.height)
            }), // South
            new EdgeCollider({begin: new Vector(0, 0), end: new Vector(0, screenBounds.height)}), // West
        ]);

        this.engine.add(new Actor({
            name: 'Screen collider',
            pos: Vector.Zero,
            anchor: Vector.Zero,
            collider,
        }).addComponent(new BlockVisibilityComponent(undefined, false)));
    }
}