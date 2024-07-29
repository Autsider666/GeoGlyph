import {Actor, BoundingBox, Scene, Vector} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {EnvironmentObject} from "../../Utility/Excalibur/Actor/EnvironmentObject.ts";
import {DirtyComponent} from "../../Utility/Excalibur/ECS/Component/DirtyComponent.ts";
import {
    PointerClickToPositionComponent
} from "../../Utility/Excalibur/ECS/Component/PointerClickToPositionComponent.ts";
import {KeyboardControlledComponent} from "../../Utility/Excalibur/Movement/Component/KeyboardControlledComponent.ts";
import {ViewPointModifiers} from "../../Utility/Excalibur/Utility/ViewPoint.ts";
import {FogLayer} from "../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {ShadowLayer} from "../../Utility/Excalibur/Visibility/Actor/ShadowLayer.ts";
import {ViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {VisibilitySystem} from "../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {VisibilityHelper} from "../../Utility/Excalibur/Visibility/Utility/VisibilityHelper.ts";
import {Machina} from "../Actor/Machina.ts";
import {EnemyVisibilitySystem} from "../System/EnemyVisibilitySystem.ts";

const objects: Actor[] = [
    //TOP LEFT
    EnvironmentObject.Rectangular({
        name: 'Top Left',
        pos: new Vector(300, 400),
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
        anchor: Vector.Zero,
        rotation: Math.PI / 3 * 2
    }),
    //TOP Center
    EnvironmentObject.Rectangular({
        name: 'Top Center',
        pos: new Vector(600, 300),
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
        anchor: Vector.Zero,
    }),
    //TOP RIGHT
    EnvironmentObject.Rectangular({
        name: 'Top Right',
        pos: new Vector(700, 400),
        width: 100,
        height: 100,
        color: ColorPalette.accentDarkColor,
        anchor: Vector.Zero,
    }),
    //BOTTOM LEFT
    EnvironmentObject.Rectangular({
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
    EnvironmentObject.Polygonal({
        name: 'Polygon Bottom Left',
        pos: new Vector(350, 650),
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
    EnvironmentObject.Polygonal({
        name: 'Polygon Center',
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
        rotation: -Math.PI / 3,
    }),
    EnvironmentObject.Polygonal({
        name: 'Polygon Center Right',
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
        );

        this.add(new FogLayer(worldBounds, {
            // alpha: 0.75,
            // color: 'white',
        }));
        this.add(new ShadowLayer(worldBounds));

        const viewPoint = new Machina(worldBounds.center, 50);
        viewPoint.addComponent(new KeyboardControlledComponent(() => 100));
        viewPoint.addComponent(new DirtyComponent());
        this.add(viewPoint);

        this.add(this.createViewPoint('Monster', new Vector(100, 100), undefined, true));
        this.add(this.createViewPoint('Ally Top', worldBounds.center.sub(new Vector(0, 100)), undefined, false));
        this.add(this.createViewPoint('Ally Left', worldBounds.center.sub(new Vector(100, -100)), undefined, false));

        for (const object of objects) {
            this.add(object);
        }

        this.camera.strategy.lockToActor(viewPoint);
        this.camera.strategy.limitCameraBounds(worldBounds);

        this.add(VisibilityHelper.createOuterBoundsCollider(worldBounds));
    }

    private createViewPoint(name: string, position: Vector, speed: number | undefined, hideViewPoint: boolean): Actor {
        const viewPoint = new Actor({
            name,
            pos: position,
            radius: 10,
            color: ColorPalette.accentLightColor,
        });
        const viewPoints: ViewPointModifiers[] = [
            // {
            //     getRange: (): number => 10,
            //     getFalloff: (): number => 1, //0.75
            // },
            {
                getRange: (): number => 100, // 150, //250
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
}