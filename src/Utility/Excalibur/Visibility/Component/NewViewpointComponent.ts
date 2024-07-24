import {
    Actor,
    Circle,
    CircleCollider,
    Color,
    Engine,
    GraphicsGroup,
    Line,
    PolygonCollider,
    Ray,
    Vector
} from "excalibur";
import {BlocksVisibilityTag} from "../../../../Magitek/Actor/tags.ts";
import {ArrayHelper} from "../../../ArrayHelper.ts";
import {CanvasHelper} from "../../../CanvasHelper.ts";
import {RadianHelper} from "../../../RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";

type ViewPointData = {
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}

type Edge = {
    pos: Vector,
    object: Actor,
    isPolygon: boolean,
    angle: number,
    distance: number,
    centerDiff: number,
    extend: boolean | Vector | null,
    color?: Color,
}

export class NewViewpointComponent extends BaseComponent implements ViewPoint {
    private static defaultAngle: number = RadianHelper.Circle;
    private static defaultRange: number = Infinity;
    private static defaultFalloff: number = 0;
    private readonly initializedEntities = new Set<number>(); //TODO remove

    private visibleEdges: Edge[] = [];

    constructor(
        private readonly viewPoints: ViewPointData[]
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        owner.on('preupdate', ({engine}) => {
            for (const child of owner.children) {
                if (child.hasTag('debugDraw')) {
                    child.unparent();
                }
            }

            const visionBlockers = engine.currentScene.world.queryTags([BlocksVisibilityTag]).entities;
            this.visibleEdges = [];
            const tempCollisionSolutionCache: string[] = []; //FIXME fix asap
            for (const visionBlocker of visionBlockers) {
                if (visionBlocker.id === owner.id || !(visionBlocker instanceof Actor) || this.initializedEntities.has(visionBlocker.id)) {
                    continue;
                }

                const edges = this.getEdges(owner, visionBlocker);

                const visibleEdges: Edge[] = this.getVisibleEdges(engine, owner, visionBlocker, edges, tempCollisionSolutionCache);

                this.debugDraw(engine, owner, visibleEdges);

                // this.initializedEntities.add(visionBlocker.id);

                this.visibleEdges = this.visibleEdges.concat(visibleEdges);
            }

            this.visibleEdges = this.visibleEdges.sort((a: Edge, b: Edge) => {
                if (a.angle === b.angle) {
                    // return 0;
                    if (a.distance === b.distance) {
                        throw new Error('Ok, so we need edge filtering');
                    }

                    // if (a.centerDiff - b.centerDiff < 0) {
                    //     return a.distance < b.distance ? -1 : 1;
                    // }
                    //
                    // return a.distance > b.distance ? -1 : 1;
                    throw new Error('Should never happen again.... right?');

                    // return a.centerDiff - b.centerDiff < 0 ? -1 : 1;
                }

                return a.angle < b.angle ? -1 : 1;
            });
        });
    }

    public drawViewPoint(ctx: CanvasRenderingContext2D): void {
        const owner = this.owner;
        if (!owner) {
            console.warn('Skipped drawing because of lack of owner');
            return;
        }

        const pos = owner.pos;
        // const centerX = pos.x;
        // const centerY = pos.y;
        // const direction = owner.rotation;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;

        for (const {
            // getAngle = (): number => NewViewpointComponent.defaultAngle,
            getRange = (): number => NewViewpointComponent.defaultRange,
            getFalloff = (): number => NewViewpointComponent.defaultFalloff,
        } of this.viewPoints) {
            // const angle = getAngle();
            // const startAngle = direction - angle / 2;
            // const endAngle = direction + angle / 2;


            const range = getRange();
            ctx.fillStyle = CanvasHelper.posToGradient(
                ctx,
                pos,
                range,
                'rgba(0,0,0,0)',
                'rgba(0,0,0,1)',
                getFalloff()
            );

            let extraEdge: Vector | undefined;
            // let previousEdge: Vector = this.visibleEdges[this.visibleEdges.length - 1].pos;
            const polygon = new Path2D();
            for (const edge of this.visibleEdges) {
                // const points = [pos, previousEdge];
                if (extraEdge) {
                    // points.push(extraEdge);
                    polygon.lineTo(extraEdge.x, extraEdge.y);

                    extraEdge = undefined;
                }
                if (edge.extend) {
                    let extendedEdge: Vector | undefined;
                    if (edge.extend instanceof Vector) {
                        extendedEdge = edge.extend;
                    } else if (!edge.isPolygon) {
                        extendedEdge = owner.pos.add(edge.pos.sub(owner.pos).normalize().scale(range));
                    } else {
                        extendedEdge = owner.pos.add(edge.pos.sub(owner.pos).normalize().scale(range));

                        const distance = extendedEdge.distance(edge.pos);
                        const hit = edge.object.collider.get().rayCast(
                            new Ray(extendedEdge, edge.pos.sub(extendedEdge)),
                            distance + 1,
                        );

                        if (!hit || hit.distance + 1 < distance) {
                            extendedEdge = undefined;
                        }
                    }

                    if (extendedEdge !== undefined) {
                        const centerAngle = edge.object.pos.sub(owner.pos).toAngle();
                        if (centerAngle - edge.angle > 0) {
                            // points.push(extendedEdge);
                            polygon.lineTo(extendedEdge.x, extendedEdge.y);
                        } else {
                            extraEdge = extendedEdge;
                        }
                    }
                }
                // points.push(edge.pos);

                polygon.lineTo(edge.pos.x, edge.pos.y);

                // CanvasHelper.drawPolygon(ctx, points);

                // previousEdge = edge.pos;
            }

            if (extraEdge) {
                polygon.lineTo(extraEdge.x, extraEdge.y); //Fixes the missing edge on the right
            }

            ctx.fill(polygon);

            for (const visibleActor of ArrayHelper.onlyUnique(this.visibleEdges.map(edge => edge.object))) {
                const collider = visibleActor.collider.get();
                if (collider === undefined) {
                    throw new Error('Hmmm, should never happen after the filtering');
                }

                if (collider instanceof CircleCollider) {
                    ctx.arc(
                        visibleActor.pos.x,
                        visibleActor.pos.y,
                        collider.radius,
                        0,
                        RadianHelper.Circle,
                    );
                    ctx.fill();
                } else if (collider instanceof PolygonCollider) {
                    CanvasHelper.drawPolygon(ctx, collider.bounds.getPoints());
                } else {
                    console.log('Unimplemented Collider type: ', collider);
                }
            }
        }
    }

    private getEdges(owner: Actor, target: Actor): Vector[] {
        const collider = target.collider.get();
        if (collider === undefined) {
            return [];
        }

        if (collider instanceof CircleCollider) {
            return RadianHelper.calculateTangents(owner.pos, target.pos, collider.radius, 10000) ?? [];
        }

        return collider.bounds.getPoints();
    }

    private debugDraw(_: Engine, owner: Actor, edges: Edge[]): void {
        const blockerIterator: Record<number, number> = {};
        for (const edge of edges) { //FIXME make it work with persistent actors
            const blockerId = edge.object.id;
            if (blockerIterator[blockerId] === undefined) {
                blockerIterator[blockerId] = 0;
            }


            const coordinate = new Actor({
                pos: edge.pos.sub(owner.pos),
                radius: 5,
                color: edge.color ?? Color.Red,
            });
            coordinate.z = 1;

            const group = new GraphicsGroup({
                members: [
                    {
                        graphic: new Circle({
                            radius: 4,
                            color: edge.color ?? Color.Red,
                        }),
                        offset: new Vector(-5, -5),
                        useBounds: false
                    },
                    {
                        graphic: new Line({
                            start: Vector.Zero,
                            end: owner.pos.sub(edge.pos),
                            color: edge.color ?? Color.Yellow,
                            thickness: 2,
                        }),
                        offset: Vector.Zero,
                        useBounds: false
                    },
                ],
                useAnchor: false,
            });

            coordinate.graphics.use(group);
            coordinate.addTag(`debugDraw`);
            coordinate.addTag(`debugDraw-${blockerId}`);

            owner.addChild(coordinate);

            // const line = new Actor({pos: edge.pos});
            // line.graphics.anchor = Vector.Zero;
            // line.graphics.use(new Line({
            //     start: Vector.Zero,
            //     end: owner.pos.sub(edge.pos),
            //     color: Color.Yellow,
            //     thickness: 2,
            // }));
            // coordinate.addChild(line);
        }
    }

    private getVisibleEdges(engine: Engine, owner: Actor, blocker: Actor, edges: Vector[], tempCollisionSolutionCache: string[]): Edge[] {
        const visibleEdges: Edge[] = [];
        for (const edge of edges) {
            const ray = new Ray(owner.pos, edge.sub(owner.pos));
            // const hit = blocker.collider.get().rayCast(ray);
            const hits = engine.currentScene.physics.rayCast(ray, {
                searchAllColliders: true,
                filter: hit => hit.collider.owner.hasTag(BlocksVisibilityTag),
                maxDistance: edge.distance(owner.pos) * 2,
            });

            const hit = hits[0];
            if (hit && hit.collider.owner !== blocker) {
                // Not the same as blocker

                const contacts = hit.collider.collide(blocker.collider.get());
                for (const contact of contacts) {
                    if (tempCollisionSolutionCache.includes(contact.id)) {
                        continue;
                    }

                    tempCollisionSolutionCache.push(contact.id);

                    visibleEdges.push(this.toEdge(contact.info.point, owner, blocker, null, Color.Pink));
                }

                if (contacts.length === 0) {
                    if (owner.pos.distance(edge) < owner.pos.distance(hit.point)) {
                        visibleEdges.push(this.toEdge(edge, owner, blocker, hit.point, Color.Orange));
                        // visibleEdges.push(this.toEdge(hit.point, owner, blocker, Color.White));
                    } else { // Something closer in the way
                        // visibleEdges.push(this.toEdge(hit.point, owner, blocker, undefined, Color.Black));
                    }
                }

                continue;
            }

            if (hit && hit.distance + 1 < edge.distance(owner.pos)) {
                // Same as blocker, but not visible

                // visibleEdges.push(this.toEdge(edge, owner, blocker, Color.White));
                continue;
            }


            const pos: Vector = hit?.point ?? edge;

            if (pos.x === Infinity || pos.x === -Infinity) {
                continue;
            }

            const extendedEdge = !hit || blocker.collider.get() instanceof CircleCollider;

            visibleEdges.push(this.toEdge(pos, owner, blocker, extendedEdge, extendedEdge ? Color.DarkGray : Color.Red));
        }

        if (visibleEdges.length === 0) {
            return [];
        }

        let minEdge: Edge | undefined;
        let maxEdge: Edge | undefined;
        for (const edge of visibleEdges) {
            if (edge.angle < (minEdge?.angle ?? Infinity)) {
                minEdge = edge;
            }

            if (edge.angle > (maxEdge?.angle ?? -Infinity)) {
                maxEdge = edge;
            }
        }

        if (!minEdge || !maxEdge) {
            throw new Error('Todo');
        }

        if (minEdge.extend === false) {
            minEdge.extend = true;
            minEdge.color = Color.Black; //FIXME marks non side edges if colliding
        }

        if (maxEdge.extend === false) {
            maxEdge.extend = true;
            maxEdge.color = Color.Yellow;
        }

        return visibleEdges;
    }

    private toEdge(edge: Vector, owner: Actor, blocker: Actor, extend?: boolean | Vector | null, color?: Color): Edge {
        return {
            angle: edge.sub(owner.pos).toAngle(),
            isPolygon: blocker.collider.get() instanceof PolygonCollider, //TODO remove
            object: blocker,
            pos: edge,
            distance: owner.pos.distance(edge),
            centerDiff: blocker.pos.distance(edge),
            extend: extend !== undefined ? extend : false,// !hit || blocker.collider.get() instanceof CircleCollider,
            color,
        };
    }


}