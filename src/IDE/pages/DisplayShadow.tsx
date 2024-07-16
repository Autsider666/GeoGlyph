import {Actor, Color, Random, Vector} from "excalibur";
import {ReactElement} from "react";
import {FogLayer} from "../components/Excalibur/Actor/Shadow/FogLayer.ts";
import {Player} from "../components/Excalibur/Actor/Shadow/Player.ts";
import {ShadowLayer} from "../components/Excalibur/Actor/Shadow/ShadowLayer.ts";
import {ExcaliburContainer} from "../components/Excalibur/ExcaliburContainer.tsx";

const random = new Random();

const player = new Player({
    pos: new Vector(200, 200),
    radius: 10,
    color: Color.Red,
});

const actors: Actor[] = [player];

actors.push(new ShadowLayer(player));
actors.push(new FogLayer(player));

for (let i = 0; i < 10; i++) {
    actors.push(new Actor({
        pos: new Vector(random.integer(0, self.innerWidth), random.integer(0, self.innerHeight)),
        radius: random.integer(10, 50),
        color: Color.Green,
    }));
}

export const DisplayShadow = (): ReactElement => {
    return <ExcaliburContainer actors={actors}/>;
};