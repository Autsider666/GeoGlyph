import {Actor, Color, Scene} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {KeyboardControlledComponent} from "../../Utility/Excalibur/Movement/Component/KeyboardControlledComponent.ts";
import {FogLayer} from "../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {NewViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/NewViewpointComponent.ts";
import {ViewpointComponent} from "../../Utility/Excalibur/Visibility/Component/ViewpointComponent.ts";
import {VisibilitySystem} from "../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {BlocksVisibilityTag} from "../Actor/tags.ts";
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
    }),
    //TOP Center
    new Actor({
        name: 'Top Center',
        x: 400,
        y: 0,
        radius: 200,
        color: Color.Blue,
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
    new Actor({
        name: 'Bottom Right',
        x: 450,
        y: 425,
        radius: 100,
        color: Color.Blue,
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
            alpha: 1,
            // color: 'white',
        }));
        // this.world.add(new ShadowLayer());

        const viewPoint = new Actor({
            x: 300,
            y: 300,
            radius: 10,
            color: ColorPalette.accentLightColor,
        });
        const viewpoints = [
            // {
            //     getAngle: (): number => Math.PI,
            //     getRange: (): number => 1000,
            // },
            {
                getRange: (): number => 500, //250
                getFalloff: (): number => 0.9999, //0.75
            }
        ];

        viewPoint.addComponent(new ViewpointComponent(viewpoints));
        viewPoint.addComponent(new NewViewpointComponent(viewpoints));
        viewPoint.addComponent(new KeyboardControlledComponent(() => 50));

        this.add(viewPoint);

        for (const object of objects) {
            object.addTag(BlocksVisibilityTag);
            this.add(object);
        }

        // this.camera.strategy.lockToActor(viewPoint);
    }
}