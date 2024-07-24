import {ReactElement} from "react";
import {ArenaScene} from "../../../Magitek/Scene/ArenaScene.ts";
import {ExcaliburContainer} from "../../../Utility/Excalibur/ExcaliburContainer.tsx";

const scenes = {
    'arena': new ArenaScene(),
};

export const DisplayArena = (): ReactElement => {
    return <ExcaliburContainer scene="arena" scenes={scenes}/>;
};