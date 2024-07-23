import {Actor, EventEmitter} from "excalibur";
import {BaseBullet} from "../Ammo/BaseBullet.ts";
import {BulletAttributes} from "../Ammo/BulletAttributes.ts";
import {BaseGun} from "../BaseGun.ts";

export type Events = {
    bulletDeath?: Actor,
    empty?: undefined,
}

type Attributes = {
    size: number,
}

export abstract class BaseMagazine {
    protected attributes?: BulletAttributes;
    private readonly _size: number;
    private bullets: BaseBullet[] = [];
    private bulletIndex: number = 0;
    private _reloadTime: number = 0;

    public readonly events: EventEmitter<Events> = new EventEmitter<Events>();

    protected constructor({
                              size,
                          }: Attributes) {
        if (size < 1) {
            throw new Error('Magazine size is smaller than 1: ' + size);
        }

        this._size = size;
    }

    abstract buildBullet(attributes: BulletAttributes): BaseBullet;

    get size(): number {
        return this._size;
    }

    get reloadTime(): number {
        return this._reloadTime;
    }

    set reloadTime(reloadTime: number) {
        this._reloadTime = reloadTime;
    }

    reload(): void {
        this.bulletIndex = 0;
        this._reloadTime = 2000;
    }

    getBullet(): BaseBullet | undefined {
        if (this.count === 0 || this._reloadTime > 0) {
            return undefined;
        }

        if (!this.attributes) {
            throw new Error('Handle this in a better way...');
        }

        let bullet: BaseBullet | undefined = this.bullets[this.bulletIndex++];
        if (bullet === undefined) {
            bullet = this.buildBullet(this.attributes);

            bullet.on('postkill', () => {
                if (!bullet) {
                    throw new Error('Just to make sure the IDE is just crazy');
                }

                this.events.emit('bulletDeath', bullet.hit);

                const parent = bullet.parent;
                if (parent === null) {
                    bullet.scene?.remove(bullet);
                } else {
                    parent.removeChild(bullet);
                }
            });

            this.bullets.push(bullet);
        }

        if (this.count === 0) {
            this.events.emit('empty');
        }

        return bullet;
    }

    get count(): number {
        return this._size - this.bulletIndex;
    }

    bind(gun: BaseGun): void {
        this.attributes = gun.attributes;
    }
}