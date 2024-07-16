import {DisplayMode, Engine, Vector} from "excalibur";
import {ReactElement, useEffect, useRef, useState} from "react";
import {ProceduralAnimal} from "./Actor/ProceduralAnimal.ts";

export const ExcaliburContainer = (): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameEngine, setGameEngine] = useState<Engine | undefined>();

    // const gameEngine = useMemo(() => {
    //     if (!canvasRef.current) {
    //         return undefined;
    //     }
    //
    //     const engine = new Engine({
    //         canvasElement: canvasRef.current,
    //         displayMode: DisplayMode.FitContainerAndFill,
    //     });
    //
    //     engine.start();
    //
    //     return engine;
    //
    // }, [canvasRef.current]);

    useEffect(() => {
        if (!canvasRef.current || gameEngine) {
            return;
        }

        console.log(gameEngine);

        // @ts-expect-error No clue why my ide doesn't understand this.
        const resetGame = (): void => gameEngine?.stop();

        resetGame();
        const game = new Engine({
            canvasElement: canvasRef.current,
            displayMode: DisplayMode.FitContainerAndFill,
        });

        game.add(new ProceduralAnimal(new Vector(200, 200)));
        console.log(1);
        game.start();

        setGameEngine(game);

        return resetGame;
    }, [gameEngine]);

    return <canvas style={{width: '100%'}} ref={canvasRef}></canvas>;
};