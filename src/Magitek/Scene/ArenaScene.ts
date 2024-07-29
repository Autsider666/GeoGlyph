import {BoundingBox, Random, Scene, Vector} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {EnvironmentObject} from "../../Utility/Excalibur/Actor/EnvironmentObject.ts";
import {CommandHandler} from "../../Utility/Excalibur/CommandHandling/CommandHandler.ts";
import {SelectionAreaHandler} from "../../Utility/Excalibur/InputHandling/Actor/SelectionAreaHandler.ts";
import {DirectInputSystem} from "../../Utility/Excalibur/InputHandling/System/DirectInputSystem.ts";
import {FogLayer} from "../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {VisibilitySystem} from "../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {VisibilityHelper} from "../../Utility/Excalibur/Visibility/Utility/VisibilityHelper.ts";
import {Machina} from "../Actor/Machina.ts";
import {EnemySpawnerComponent} from "../Component/EnemySpawnerComponent.ts";
import {EnemySpawnerSystem} from "../System/EnemySpawnerSystem.ts";
import {EnemyVisibilitySystem} from "../System/EnemyVisibilitySystem.ts";

export class ArenaScene extends Scene {
    private readonly commandHandler: CommandHandler = new CommandHandler();

    onInitialize(): void {
        this.backgroundColor = ColorPalette.backgroundDarkColor;
        this.world.add(VisibilitySystem);
        this.world.add(EnemyVisibilitySystem);
        this.world.add(new DirectInputSystem(this.world, this.commandHandler));
        this.world.add(new EnemySpawnerSystem(this.world, 50, 300));
    }

    onActivate(): void {
        this.world.add(this.commandHandler);

        const worldBounds = BoundingBox.fromDimension(1000, 1000, Vector.Zero);

        this.add(VisibilityHelper.createOuterBoundsCollider(worldBounds));

        this.world.add(new FogLayer(worldBounds));
        // this.world.add(new ShadowLayer());

        this.world.add(new SelectionAreaHandler());

        const random = new Random();
        for (let dX = 0; dX < 2; dX++) {
            for (let dY = 0; dY < 2; dY++) {
                this.add(new Machina(new Vector(200 + 200 * dX, 200 + 200 * dY)));
            }
        }

        for (let i = 0; i < 10; i++) {
            const size = random.integer(10, 50);
            const block = EnvironmentObject.Rectangular({
                height: size,
                width: size,
                pos: new Vector(random.integer(0, self.innerWidth), random.integer(0, self.innerHeight)),
                color: ColorPalette.backgroundLightColor,

                lineWidth: 2,
                strokeColor: ColorPalette.accentLightColor,

            });

            block.addComponent(new EnemySpawnerComponent());

            this.add(block);
        }
    }
}