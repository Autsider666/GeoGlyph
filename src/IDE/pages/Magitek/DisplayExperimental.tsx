import {ReactElement} from "react";
import {ExperimentalScene} from "../../../Magitek/Scene/ExperimentalScene.ts";
import {ExcaliburContainer} from "../../../Utility/Excalibur/ExcaliburContainer.tsx";

const scenes = {
    'experimental': new ExperimentalScene(),
};

export const DisplayExperimental = (): ReactElement => {
    return <ExcaliburContainer scene="experimental" scenes={scenes}/>;
};