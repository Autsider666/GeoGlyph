import {Vector} from "excalibur";
import {ReactElement} from "react";
import {ProceduralAnimal} from "../components/Excalibur/Actor/ProceduralAnimation/ProceduralAnimal.ts";
import {ExcaliburContainer} from "../components/Excalibur/ExcaliburContainer.tsx";

const actors = [new ProceduralAnimal(new Vector(200, 200))];

export const DisplayProceduralAnimation = (): ReactElement => {
    return <ExcaliburContainer actors={actors}/>;
};