import {Scene} from "excalibur";
import {ReactElement} from "react";
import {ExcaliburContainer} from "../../components/Excalibur/ExcaliburContainer.tsx";
import {ArenaScene} from "../../../Magitek/Scene/ArenaScene.ts";


const createScene = (): Scene => new ArenaScene();

export const DisplayFieldOfView = (): ReactElement => {
    return <ExcaliburContainer createScene={createScene}/>;
};