import {Actor, Engine} from "excalibur";
import {ReactElement, useEffect, useRef, useState} from "react";

type ExcaliburContainerProps = {
    actors?: Actor[],
}

export const ExcaliburContainer = ({actors = []}: ExcaliburContainerProps): ReactElement => {
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

        // @ts-expect-error No clue why my ide doesn't understand this.
        const resetGame = (): void => gameEngine?.stop();

        resetGame();
        const game = new Engine({
            canvasElement: canvasRef.current,
            width: self.innerWidth,
            height: self.innerHeight - 52,
            // displayMode: DisplayMode.FitContainer,
        });

        for (const actor of actors) {
            game.add(actor);
        }

        game.start();

        setGameEngine(game);

        return resetGame;
    }, [actors, gameEngine]);

    return <canvas style={{width: '100%'}} ref={canvasRef}></canvas>;
};