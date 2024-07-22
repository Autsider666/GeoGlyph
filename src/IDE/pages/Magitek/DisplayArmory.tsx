import {Color, Scene, Vector} from "excalibur";
import {ReactElement} from "react";
import {ArmoryDummy} from "../../../Magitek/Actor/ArmoryDummy.ts";
import {MachineGun} from "../../../Magitek/Actor/Equipment/MachineGun.ts";
import {ArmoryScene} from "../../../Magitek/Scene/ArmoryScene.ts";
import {CollisionGroups} from "../../../Magitek/Utility/CollisionGroups.ts";
import {ExcaliburContainer} from "../../components/Excalibur/ExcaliburContainer.tsx";

const defaultDummySpeed = 25;
const defaultDummyDistance = 300;

const armoryDummy = new ArmoryDummy({
    x: defaultDummyDistance,
    y: 10,
    radius: 10,
    color: Color.Red,
    collisionGroup: CollisionGroups.Enemy,
});

armoryDummy.setSpeed(defaultDummySpeed);

armoryDummy.setRoute([
    new Vector(defaultDummyDistance, 10),
    new Vector(defaultDummyDistance, 290),
]);

const width = 500;
const height = 300;

const createScene = (): Scene => new ArmoryScene(
    new MachineGun(
        Vector.Zero, undefined, 500,
    ),
    armoryDummy,
    width,
    height,
);

export const DisplayArmory = (): ReactElement => {

    return <div className="section">
        <div className="container is-fluid">
            <ExcaliburContainer createScene={createScene} width={width} height={height}/>
        </div>
        <div className="block">
            <div className="field">
                <label className="label">Distance</label>
                <div className="control">
                    <input className="input" type="range" defaultValue={defaultDummyDistance} onChange={({target}) => {
                        const value = parseInt(target.value);
                        if (isNaN(value)) {
                            throw new Error('Input value is NaN: ' + target.value);
                        }

                        armoryDummy.setRoute([
                            new Vector(value, 10),
                            new Vector(value, height - 10),
                        ]);
                    }} min="100" max="500"/>
                </div>
            </div>

            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">
                        <div className="tags has-addons">
                            <span className="tag">Speed</span>
                            <span
                                className="tag is-info"
                                id="armory-speed"
                                style={{width: 50}}
                            >{defaultDummySpeed}</span>
                        </div>
                    </label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <input className="input" type="range" defaultValue={defaultDummySpeed}
                                   onChange={({target}) => {
                                       const value = parseInt(target.value);
                                       if (isNaN(value)) {
                                           throw new Error('Input value is NaN: ' + target.value);
                                       }

                                       armoryDummy.setSpeed(value);

                                       const valueElement = document.getElementById('armory-speed');
                                       if (valueElement) {
                                           valueElement.innerText = target.value;
                                       }
                                   }} min={0} max={500}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};