import {Actor, Color, Random, Vector} from "excalibur";
import {ReactElement} from "react";
import {FogLayer} from "../components/Excalibur/Actor/FieldOfView/FogLayer.ts";
import {Player} from "../components/Excalibur/Actor/FieldOfView/Player.ts";
import {ShadowLayer} from "../components/Excalibur/Actor/FieldOfView/ShadowLayer.ts";
import {ExcaliburContainer} from "../components/Excalibur/ExcaliburContainer.tsx";

const random = new Random();
const players:Player[] =[];
for (let dX = 0; dX < 1; dX++) {
    for (let dY = 0; dY < 1; dY++) {
        players.push(new Player({
            pos: new Vector(200 + 200 * dX, 200 + 200 * dY),
            radius: 10,
            color: Color.Red,
        }));
    }
}

const actors: Actor[] = [...players];

actors.push(new ShadowLayer(players));
actors.push(new FogLayer(players));

for (let i = 0; i < 10; i++) {
    actors.push(new Actor({
        pos: new Vector(random.integer(0, self.innerWidth), random.integer(0, self.innerHeight)),
        radius: random.integer(10, 50),
        color: Color.Green,
    }));
}

export const DisplayFieldOfView = (): ReactElement => {
    return <ExcaliburContainer actors={actors}/>;
};