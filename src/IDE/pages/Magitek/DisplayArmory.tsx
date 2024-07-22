import {Color, Scene, Vector} from "excalibur";
import {ReactElement, useState} from "react";
import {ArmoryDummy} from "../../../Magitek/Actor/ArmoryDummy.ts";
import {MachineGun} from "../../../Magitek/Actor/Equipment/MachineGun.ts";
import {ArmoryScene} from "../../../Magitek/Scene/ArmoryScene.ts";
import {CollisionGroups} from "../../../Magitek/Utility/CollisionGroups.ts";
import {ExcaliburContainer, ExcaliburOptions} from "../../../Utility/Excalibur/ExcaliburContainer.tsx";

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

const options: ExcaliburOptions = {
    width,
    height,
    suppressConsoleBootMessage: true,
    scenes: {
        armory: new ArmoryScene(
            new MachineGun(
                Vector.Zero, undefined, 500,
            ),
            armoryDummy,
            width,
            height,
        ),
        test: new Scene(),
    },
};

export const DisplayArmory = (): ReactElement => {
    const [distance, setDistance] = useState(defaultDummyDistance);
    const [speed, setSpeed] = useState(defaultDummySpeed);
    const [scene, setScene] = useState('armory');

    return <div className="section">
        <div className="container is-fluid">
            <ExcaliburContainer options={options} scene={scene}/>
        </div>
        <button className="button" onClick={() => {
            setScene(scene === 'armory' ? 'test' : 'armory');
        }}>scene change test
        </button>
        <div className="block">
            <div className="field">
                <label className="label">
                    <div className="tags has-addons">
                        <span className="tag">Distance</span>
                        <span
                            className="tag is-info"
                            style={{width: 50}}
                        >{distance}</span>
                    </div>
                </label>
                <div className="control">
                    <input
                        className="input"
                        type="range"
                        value={distance}
                        min="100"
                        max="500"
                        onChange={({target}) => {
                            const value = parseInt(target.value);
                            if (isNaN(value)) {
                                throw new Error('Input value is NaN: ' + target.value);
                            }

                            armoryDummy.setRoute([
                                new Vector(value, 10),
                                new Vector(value, height - 10),
                            ]);

                            setDistance(value);
                        }}
                    />
                </div>
            </div>

            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">
                        <div className="tags has-addons">
                            <span className="tag">Speed</span>
                            <span
                                className="tag is-info"
                                style={{width: 50}}
                            >{speed}</span>
                        </div>
                    </label>
                </div>
                <div className="field-body">
                    <div className="field">
                        <div className="control">
                            <input
                                className="input"
                                type="range"
                                value={speed}
                                min={0}
                                max={500}
                                onChange={({target}) => {
                                    const value = parseInt(target.value);
                                    if (isNaN(value)) {
                                        throw new Error('Input value is NaN: ' + target.value);
                                    }

                                    armoryDummy.setSpeed(value);

                                    setSpeed(speed);
                                }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};