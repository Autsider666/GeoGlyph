import {Scene} from "excalibur";
import {ReactElement} from "react";
import {ExcaliburContainer} from "../components/Excalibur/ExcaliburContainer.tsx";
import {VisibilityScene} from "../components/Excalibur/Scene/VisibilityScene.ts";


const createScene = (): Scene => new VisibilityScene();

export const DisplayFieldOfView = (): ReactElement => {
    return <ExcaliburContainer createScene={createScene}/>;
};