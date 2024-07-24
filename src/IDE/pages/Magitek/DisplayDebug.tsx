import {ReactElement} from "react";
import {DebugScene} from "../../../Magitek/Scene/DebugScene.ts";
import {ExcaliburContainer} from "../../../Utility/Excalibur/ExcaliburContainer.tsx";

const scenes = {
    'debug': new DebugScene(),
};

export const DisplayDebug = (): ReactElement => {
    return <ExcaliburContainer scene="debug" scenes={scenes}/>;
};