import {EventEmitter} from "excalibur";
import {BaseBullet} from "../Ammo/BaseBullet.ts";
import {BulletAttributes} from "../Ammo/BulletAttributes.ts";
import {BaseGun} from "../BaseGun.ts";
import {BaseMagazine, Events} from "./BaseMagazine.ts";

export class ArmoryWrapperMagazine extends BaseMagazine {
    public readonly events: EventEmitter<Events>;
    private readonly hits: boolean[] = [];

    constructor(private readonly magazine: BaseMagazine) {
        super({
            size: 1,
        });

        this.events = magazine.events;

        this.events.on('bulletDeath', (target) => {
            this.hits.push(target !== undefined);
            while (this.hits.length > this.size) {
                this.hits.splice(0, 1);
            }
        });
    }

    getMagazine(): BaseMagazine {
        return this.magazine;
    }

    get size(): number {
        return this.magazine.size;
    }

    get reloadTime(): number {
        return this.magazine.reloadTime;
    }

    set reloadTime(reloadTime: number) {
        this.magazine.reloadTime = reloadTime;
    }

    override get count(): number {
        return this.magazine.count;
    }

    override getBullet(): BaseBullet | undefined {
        return this.magazine.getBullet();
    }

    override buildBullet(attributes: BulletAttributes): BaseBullet {
        return this.magazine.buildBullet(attributes);
    }

    override reload(): void {
        this.magazine.reload();
    }

    override bind(gun: BaseGun): void {
        this.magazine.bind(gun);
    }

    getStats(): {
        maxBullets: number,
        remainingBullets: number,
        hits: number,
        accuracy: number,
    } {
        const hits = this.hits.filter(hit => hit).length;

        return {
            accuracy: this.hits.length === 0 ? 0 : hits / this.hits.length * 100,
            hits,
            maxBullets: this.size,
            remainingBullets: this.count,
        };
    }
}