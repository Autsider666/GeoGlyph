import {Actor, Color, CompositeCollider, CoordPlane, EdgeCollider, Scene, Vector} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {
    PointerClickToPositionComponent
} from "../../Utility/Excalibur/ECS/Component/PointerClickToPositionComponent.ts";
import {KeyboardControlledComponent} from "../../Utility/Excalibur/Movement/Component/KeyboardControlledComponent.ts";
import {FogLayer} from "../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {BlockVisibilityComponent} from "../../Utility/Excalibur/Visibility/Component/BlockVisibilityComponent.ts";
import {NewViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/NewViewpointComponent.ts";
import {ViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {VisibilitySystem} from "../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {EnemyVisibilitySystem} from "../System/EnemyVisibilitySystem.ts";

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
            alpha: 0.75,
            // color: 'white',
        }));
        // this.world.add(new ShadowLayer());

        const viewPoint = new Actor({
            name: 'Player',
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
                getRange: (): number => 700, //250
                getFalloff: (): number => 0.9999, //0.75
            }
        ];

        viewPoint.addComponent(new PointerClickToPositionComponent());
        viewPoint.addComponent(new ViewpointComponent(viewPoints));
        viewPoint.addComponent(new NewViewpointComponent(viewPoints));
        viewPoint.addComponent(new KeyboardControlledComponent(() => 50));

        this.add(viewPoint);

        for (const object of objects) {
            object.addComponent(new BlockVisibilityComponent());
            this.add(object);
        }

        // this.camera.strategy.lockToActor(viewPoint);

        this.createScreenCollider();
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
        }).addComponent(new BlockVisibilityComponent()));
    }
}