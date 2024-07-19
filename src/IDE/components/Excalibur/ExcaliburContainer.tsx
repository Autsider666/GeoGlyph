import {Actor, Engine, Scene} from "excalibur";
import {ReactElement, useEffect, useRef} from "react";

type ExcaliburContainerProps = {
    actors?: Actor[],
    createScene?: () => Scene,
}

let gameEngine: Engine | undefined = undefined;

export const ExcaliburContainer = ({actors = [], createScene}: ExcaliburContainerProps): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current || gameEngine) {
            return;
        }

        const resetGame = (): void => {
            gameEngine?.stop();
            gameEngine = undefined;
        };

        resetGame();
        const game = new Engine({
            canvasElement: canvasRef.current,
            width: self.innerWidth,
            height: self.innerHeight - 52,
            // displayMode: DisplayMode.FitContainer,
        });

        canvasRef.current.oncontextmenu = (): boolean => false;

        const currentScene = createScene ? createScene() : game.currentScene;
        if (createScene) {
            game.addScene('scene', currentScene);
        }

        for (const actor of actors) {
            currentScene.add(actor);
        }

        game.start().then(() => {
            game.goToScene('scene');
        });

        gameEngine = game;

        return resetGame;
    }, [actors, createScene]);

    return <canvas style={{width: '100%'}} ref={canvasRef}></canvas>;
};