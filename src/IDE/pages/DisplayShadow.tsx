import {Actor, Color, Random, Vector} from "excalibur";
import {ReactElement} from "react";
import {ShadowLayer} from "../components/Excalibur/Actor/Shadow/ShadowLayer.ts";
import {ExcaliburContainer} from "../components/Excalibur/ExcaliburContainer.tsx";

const random = new Random();
const shadow = new ShadowLayer();

for (let i = 0; i < 10; i++) {
    shadow.addChild(new Actor({
        pos: new Vector(random.integer(0, self.innerWidth), random.integer(0, self.innerHeight)),
        radius: random.integer(10, 50),
        color: Color.Green,
    }));
}

const actors: Actor[] = [shadow];

export const DisplayShadow = (): ReactElement => {
    return <ExcaliburContainer actors={actors}/>;
};