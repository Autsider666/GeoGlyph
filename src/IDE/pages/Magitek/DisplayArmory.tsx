import classNames from "classnames";
import {Color, Scene, Vector} from "excalibur";
import {ReactElement, useEffect, useState} from "react";
import {ArmoryDummy} from "../../../Magitek/Actor/ArmoryDummy.ts";
import {MachineGun} from "../../../Magitek/Actor/Equipment/MachineGun.ts";
import {ArmoryWrapperMagazine} from "../../../Magitek/Actor/Equipment/Magazine/ArmoryWrapperMagazine.ts";
import {RegularMagazine} from "../../../Magitek/Actor/Equipment/Magazine/RegularMagazine.ts";
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

const ammo = new ArmoryWrapperMagazine(new RegularMagazine());

const options: ExcaliburOptions = {
    width,
    height,
    suppressConsoleBootMessage: true,
    scenes: {
        armory: new ArmoryScene(
            new MachineGun('Friendly', ammo),
            // new OldMachineGun(
            //     Vector.Zero, undefined, 500,
            // ),
            armoryDummy,
            width,
            height,
        ),
        test: new Scene(),
    },
};

export const DisplayArmory = (): ReactElement => {
    const [distance, setDistance] = useState(defaultDummyDistance);
    const [position, setPosition] = useState(10);
    const [speed, setSpeed] = useState(defaultDummySpeed);
    const [hits, setHits] = useState(0);
    const [ammoStats, setAmmoStats] = useState({
        total: ammo.size,
        current: ammo.count,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setAmmoStats({total: ammo.size, current: ammo.count});
            setPosition(Math.round(armoryDummy.pos.y));

            if (ammoStats.current === ammo.count) {
                setHits(0);
            }
        }, 100);

        const subscription = ammo.events.on('bulletDeath', (target) => {
            if (target !== undefined) {
                setHits(hits + 1);
            }
        });

        return (): void => {
            clearInterval(interval);
            subscription.close();
        };
    }, [ammoStats, hits]);

    return <div className="section">
        <div className="container is-fluid">
            <ExcaliburContainer options={options} scene={'armory'}/>
        </div>
        <progress
            className={classNames({
                progress: true,
                'is-success': ammoStats.current / ammoStats.total > 0.25 && ammo.reloadTime <= 0,
                'is-warning': ammoStats.current / ammoStats.total <= 0.25 && ammo.reloadTime <= 0,
                'is-info': ammo.reloadTime > 0,
            })}

            value={ammo.reloadTime <= 0 ? ammoStats.current : 2000 - ammo.reloadTime}
            max={ammo.reloadTime <= 0 ? ammoStats.total : 2000}
        ></progress>
        <div>Accuracy: {hits}/{ammoStats.total} = {(hits / ammoStats.total * 100).toFixed(2)}%</div>
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
                            const newDistance = parseInt(target.value);
                            if (isNaN(newDistance)) {
                                throw new Error('Input value is NaN: ' + target.value);
                            }

                            armoryDummy.setRoute([
                                new Vector(newDistance, 10),
                                new Vector(newDistance, height - 10),
                            ]);

                            armoryDummy.pos.setTo(newDistance, position);

                            setDistance(newDistance);
                        }}
                    />
                </div>
            </div>

            <div className="field">
                <label className="label">
                    <div className="tags has-addons">
                        <span className="tag">Position</span>
                        <span
                            className="tag is-info"
                            style={{width: 50}}
                        >{position}</span>
                    </div>
                </label>
                <div className="control">
                    <input
                        className="input"
                        type="range"
                        value={position}
                        min={0}
                        max={height}
                        onChange={({target}) => {
                            const newPosition = parseInt(target.value);
                            if (isNaN(newPosition)) {
                                throw new Error('Input value is NaN: ' + target.value);
                            }

                            armoryDummy.pos.setTo(distance, newPosition);

                            setPosition(newPosition);
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
                                    const newSpeed = parseInt(target.value);
                                    if (isNaN(newSpeed)) {
                                        throw new Error('Input value is NaN: ' + target.value);
                                    }

                                    armoryDummy.setSpeed(newSpeed);

                                    setSpeed(newSpeed);
                                }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>;
};