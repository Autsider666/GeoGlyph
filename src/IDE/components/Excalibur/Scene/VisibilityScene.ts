import {Actor, Circle, Random, Rectangle, Scene, Vector} from "excalibur";
import {CommandHandler} from "../../../../Utility/CommandHandling/CommandHandler.ts";
import {FogLayer} from "../../../../Utility/Excalibur/Visibility/Actor/FogLayer.ts";
import {VisibilitySystem} from "../../../../Utility/Excalibur/Visibility/System/VisibilitySystem.ts";
import {ColorPalette} from "../../../ColorPalette.ts";
import {Player} from "../Actor/FieldOfView/Player.ts";
import {DirectInputController} from "../DirectInputController.ts";

export class VisibilityScene extends Scene {
    private readonly commandHandler: CommandHandler = new CommandHandler();
    private readonly directInputController: DirectInputController = new DirectInputController(this.commandHandler);

    onInitialize(): void {
        this.backgroundColor = ColorPalette.backgroundDarkColor;
        this.world.add(VisibilitySystem);
    }

    onActivate(): void {
        this.world.add(this.commandHandler);
        this.world.add(this.directInputController);

        this.world.add(new FogLayer());
        // this.world.add(new ShadowLayer());

        const playerRadius = 10;

        const random = new Random();
        for (let dX = 0; dX < 1; dX++) {
            for (let dY = 0; dY < 1; dY++) {
                const player = new Player({
                    pos: new Vector(200 + 200 * dX, 200 + 200 * dY),
                    radius: playerRadius,
                    // color: ColorPalette.accentLightColor,
                });

                player.graphics.use(new Circle({
                    radius: playerRadius,
                    color: ColorPalette.accentDarkColor,

                    lineWidth: 2,
                    strokeColor: ColorPalette.accentLightColor,
                }));

                this.add(player);
                this.directInputController.setActor(player);
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

            this.add(actor);
        }
    }
}