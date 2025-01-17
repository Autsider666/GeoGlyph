import {Actor, Engine, EngineOptions, Scene} from "excalibur";
import {ReactElement, useEffect, useId, useRef, useState} from "react";

const engines = new Map<string, Engine>();

const cleanup = new Map<string, number>();

export type ExcaliburOptions = Omit<EngineOptions, 'canvasElementId' | 'canvasElement'>

type Props = {
    currentScene?: string,
    scene?: string,
    scenes?: Record<string, Scene>,
    actors?: Actor[],
    options?: ExcaliburOptions,
}

const loadScenes = (engine: Engine, scenes: Record<string, Scene>): void => {
    for (const sceneName of Object.keys(scenes)) {
        if (engine.scenes[sceneName]) {
            continue;
        }

        engine.addScene(sceneName, scenes[sceneName]);
    }
};

const loadActors = (engine: Engine, actors: Actor[]): void => {
    const currentScene = engine.currentScene;
    for (const actor of actors) {
        if (currentScene.actors.includes(actor)) {
            continue;
        }

        currentScene.add(actor);
    }
};

export const ExcaliburContainer = ({
                                       options,
                                       scene,
                                       scenes = {},
                                       actors = [],
                                   }: Props): ReactElement => {
    const instanceId = useId();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentSceneName, setCurrentSceneName] = useState<string | undefined>(scene);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (!canvasElement) {
            throw new Error('canvasRef.current should always return HTMLCanvasElement.');
        }

        if (engines.has(instanceId)) {
            const cleanupTimeout = cleanup.get(instanceId);
            if (cleanupTimeout !== undefined) {
                clearTimeout(cleanupTimeout);
            }
            return;
        }

        canvasElement.oncontextmenu = (): boolean => false;

        const engine = new Engine({
            ...options,
            canvasElement,
        });

        loadScenes(engine, scenes);

        if (scene) {
            engine.goToScene(scene)
                .then(() => loadActors(engine, actors))
                .catch(() => console.error(`Unable to go to scene "${scene}`));
        }

        engine.start().catch(() => console.log('Unable to start Excalibur engine'));

        engines.set(instanceId, engine);

        return (): void => {
            cleanup.set(instanceId, setTimeout(() => engine.stop(), 100));
        };
    }, [actors, instanceId, options, scene, scenes]);

    useEffect(() => {
        const engine = engines.get(instanceId);
        if (!engine) {
            return;
        }

        loadScenes(engine, scenes);

        loadActors(engine, actors);

        if (scene && scene !== currentSceneName) {
            if (!Object.keys(engine.scenes).includes(scene)) {
                throw new Error(`Scene "${scene} is not loaded.`);
            }

            engine.goToScene(scene)
                .then(() => setCurrentSceneName(engine.currentSceneName))
                .catch(() => console.error(`Unable to go to scene "${scene}`));
        }
    }, [instanceId, scenes, actors, scene, currentSceneName]);

    return <canvas
        id={instanceId}
        ref={canvasRef}
    ></canvas>;
};