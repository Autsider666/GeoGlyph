import {Actor, BodyComponent, Query, Random, Scene, System, SystemType, TagQuery, Vector, World} from "excalibur";
import {Monster} from "../Actor/Monster.ts";
import {EnemyTag, FriendlyTag} from "../Actor/tags.ts";
import {EnemySpawnerComponent} from "../Component/EnemySpawnerComponent.ts";

export class EnemySpawnerSystem extends System {
    systemType: SystemType = SystemType.Update;

    private readonly random: Random = new Random();

    private readonly enemySpawnQuery: Query<typeof EnemySpawnerComponent>;
    private readonly enemyQuery: TagQuery<typeof EnemyTag>;
    private readonly friendlyQuery: TagQuery<typeof FriendlyTag>;

    private readonly friendlyActors: Actor[] = [];

    private scene!: Scene;

    constructor(
        world: World,
        private readonly maxEnemies: number = 10,
        private readonly distanceFromFriendly: number = 100,
    ) {
        super();

        this.enemySpawnQuery = world.query([EnemySpawnerComponent]);
        this.enemyQuery = world.queryTags([EnemyTag]);
        this.friendlyQuery = world.queryTags([FriendlyTag]);

        this.friendlyQuery.entityAdded$.subscribe(entity => {
            if (entity instanceof Actor && !this.friendlyActors.includes(entity)) {
                this.friendlyActors.push(entity);
            }
        });

        this.friendlyQuery.entityRemoved$.subscribe(entity => {
            if (entity instanceof Actor && this.friendlyActors.includes(entity)) {
                this.friendlyActors.splice(this.friendlyActors.indexOf(entity), 1);
            }
        });
    }

    initialize(_: World, scene: Scene): void {
        this.scene = scene;
    }

    update(): void {
        if (this.enemyQuery.entities.length >= this.maxEnemies) {
            return;
        }

        this.spawnMonster();
    }

    private spawnMonster(): void {
        const location = this.getSpawnLocation();
        if (location === undefined) {
            return;
        }

        const monster = new Monster();
        monster.pos = location;

        this.scene.add(monster);
        console.log('Monster spawned');
    }

    private getSpawnLocation(): Vector | undefined {
        if (this.friendlyActors.length === 0) {
            return undefined;
        }

        const validSpawnLocations = this.enemySpawnQuery.entities
            .map(entity => entity.get(BodyComponent)?.pos.clone())
            .filter(location => {
                if (location === undefined) {
                    return false;
                }

                for (const {pos} of this.friendlyActors) {
                    if (pos.distance(location) > this.distanceFromFriendly) { // TODO && this.lastMonsterSpawn.distance(location) > 300) {
                        return true;
                    }
                }

                return false;
            });

        if (validSpawnLocations.length === 0) {
            return undefined;
        }

        return this.random.pickOne(validSpawnLocations);
    }
}