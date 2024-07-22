import {Vector} from "excalibur";
import {ReactElement} from "react";
import {ExcaliburContainer} from "../../Utility/Excalibur/ExcaliburContainer.tsx";
import {ProceduralAnimal} from "../components/Excalibur/Actor/ProceduralAnimation/ProceduralAnimal.ts";

const actors = [new ProceduralAnimal(new Vector(200, 200))];

export const DisplayProceduralAnimation = (): ReactElement => {
    return <ExcaliburContainer actors={actors}/>;
};