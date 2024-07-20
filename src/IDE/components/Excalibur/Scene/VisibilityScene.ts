import {Actor, Random, Rectangle, Scene, Vector} from "excalibur";
import {Machina} from "../../../../Magitek/Actor/Machina.ts";
import {EnemySpawnerComponent} from "../../../../Magitek/Component/EnemySpawnerComponent.ts";
import {EnemySpawnerSystem} from "../../../../Magitek/System/EnemySpawnerSystem.ts";
import {EnemyVisibilitySystem} from "../../../../Magitek/System/EnemyVisibilitySystem.ts";
import {CommandHandler} from "../../../../Utility/Excalibur/CommandHandling/CommandHandler.ts";
import {SelectionAreaHandler} from "../../../../Utility/Excalibur/InputHandling/Actor/SelectionAreaHandler.ts";
import {DirectInputSystem} from "../../../../Utility/Excalibur/InputHandling/System/DirectInputSystem.ts";
import {FogLayer} from "../../../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {VisibilitySystem} from "../../../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {ColorPalette} from "../../../ColorPalette.ts";

export class VisibilityScene extends Scene {
    private readonly commandHandler: CommandHandler = new CommandHandler();

    onInitialize(): void {
        this.backgroundColor = ColorPalette.backgroundDarkColor;
        this.world.add(VisibilitySystem);
        this.world.add(EnemyVisibilitySystem);
        this.world.add(new DirectInputSystem(this.world, this.commandHandler));
        this.world.add(new EnemySpawnerSystem(this.world, 1, 300));
    }

    onActivate(): void {
        this.world.add(this.commandHandler);

        this.world.add(new FogLayer());
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
            const actor = new Actor({
                pos: new Vector(random.integer(0, self.innerWidth), random.integer(0, self.innerHeight)),
                // radius: size,
                height: size,
                width: size,
                // color: ColorPalette.accentLightColor,
            });

            actor.graphics.use(new Rectangle({
                height: size,
                width: size,
                color: ColorPalette.backgroundLightColor,

                lineWidth: 2,
                strokeColor: ColorPalette.accentLightColor,
            }));

            actor.addComponent(new EnemySpawnerComponent());

            this.add(actor);
        }
    }
}