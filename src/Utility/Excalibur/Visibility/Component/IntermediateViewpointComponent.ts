import {Actor, CircleCollider, Color, Line, PolygonCollider, Ray, Vector} from "excalibur";
import {BlocksVisibilityTag} from "../../../../Magitek/Actor/tags.ts";
import {RadianHelper} from "../../../RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";

type ViewPointData = {
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}

const createEdgeActor = (location: Vector): Actor => new Actor({
    pos: location,
    radius: 5,
    color: Color.Red,
});

type Edge = {
    pos: Vector,
    object: Actor,
    isPolygon: boolean,
    angle: number,
    distance: number,
    centerDiff: number,
    extend: boolean,
}

export class ViewpointComponent extends BaseComponent implements ViewPoint {
    private static defaultAngle: number = RadianHelper.Circle;
    private static defaultRange: number = Infinity;
    private static defaultFalloff: number = 0;

    private readonly edges = new Map<number, Actor[]>();
    private visibleEdges: Edge[] = [];
    private visibleActors: Actor[] = []; //TODO replace with Edge

    constructor(
        private readonly viewPoints: ViewPointData[]
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        owner.on('preupdate', ({engine,}) => {
            const visibleEdges: Edge[] = [];
            const visionBlockers = engine.currentScene.world.queryTags([BlocksVisibilityTag]).entities;
            for (const blocker of visionBlockers) {
                if (blocker.id === owner.id || !(blocker instanceof Actor) || this.edges.has(blocker.id)) {
                    continue;
                }

                const edges = this.getEdges(owner, blocker);
                this.edges.set(blocker.id, []);
                if (edges.length === 0) {
                    continue;
                }

                console.log(`---${blocker.name}---`);

                this.visibleActors.push(blocker);
                const visibleEntityEdges: Edge[] = [];
                for (const edge of edges) {
                    console.log(`## ${edge} ##`);
                    const ray = new Ray(owner.pos, edge.sub(owner.pos));
                    const hits = engine.currentScene.physics.rayCast(ray, {
                        filter: hit => hit.collider.owner.hasTag(BlocksVisibilityTag),
                        // maxDistance: 500,
                        searchAllColliders: false,
                    });

                    for (const hit of hits) {
                        if (hit.collider.owner.name === blocker.name) {
                            continue;
                        }

                        const contact = hit.collider.collide(blocker.collider.get());
                        console.log(contact);
                    }

                    console.log(hits.map(hit => hit.collider.owner.name));

                    const hit = blocker.collider.get().rayCast(ray);
                    if (hit && (hit.distance + 1 < owner.pos.distance(edge) || hit?.collider !== blocker.collider.get())) {
                        continue;
                    }

                    visibleEntityEdges.push({
                        angle: edge.sub(owner.pos).toAngle(),
                        isPolygon: blocker.collider.get() instanceof PolygonCollider,
                        object: blocker,
                        pos: edge,
                        distance: owner.pos.distance(edge),
                        centerDiff: blocker.pos.distance(edge),
                        extend: !hit || blocker.collider.get() instanceof CircleCollider,
                    });
                }

                let minEdge: Edge | undefined;
                let maxEdge: Edge | undefined;
                for (const edge of visibleEntityEdges) {
                    if (edge.angle < (minEdge?.angle ?? Infinity)) {
                        minEdge = edge;
                    }

                    if (edge.angle > (maxEdge?.angle ?? -Infinity)) {
                        maxEdge = edge;
                    }

                    visibleEdges.push(edge);
                }

                if (!minEdge || !maxEdge) {
                    throw new Error('Todo');
                }

                minEdge.extend = true;
                maxEdge.extend = true;
            }

            for (const edge of visibleEdges) {
                engine.add(createEdgeActor(edge.pos));

                const line = new Actor({pos: edge.pos});
                line.graphics.anchor = Vector.Zero;
                line.graphics.use(new Line({
                    start: Vector.Zero,
                    end: owner.pos.sub(edge.pos),
                    color: Color.Yellow,
                    thickness: 2,
                }));
                engine.add(line);

                this.visibleEdges.push(edge);
            }

            if (visibleEdges.length === 0) {
                return;
            }

            this.visibleEdges = this.visibleEdges.sort((a: Edge, b: Edge) => {
                if (a.angle === b.angle) {
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

    private getEdges(owner: Actor, target: Actor): Vector[] {
        const collider = target.collider.get();
        if (collider === undefined) {
            return [];
        }

        if (collider instanceof CircleCollider) {
            return this.calculateTangents(owner.pos, target.pos, collider.radius, 10000) ?? [];
        }

        return collider.bounds.getPoints();
    }

    // Works well for eyes (or turrets?) following a target
    private calculateTangents(viewPoint: Vector, centerCircle: Vector, radiusCircle: number, maxDistance: number): [Vector, Vector] | [Vector] | undefined {
        const {x, y} = viewPoint;

        const dx = x - centerCircle.x;
        const dy = y - centerCircle.y;
        const dr2 = dx * dx + dy * dy;

        if (dr2 <= radiusCircle * radiusCircle) {
            return undefined; // Viewpoint is inside or on the circle
        }

        const D = Math.sqrt(dr2 - radiusCircle * radiusCircle);
        const a = radiusCircle * radiusCircle / dr2;
        const b = radiusCircle * D / dr2;

        // Calculate tangent points
        const tangent1 = new Vector(a * dx + b * dy + centerCircle.x, a * dy - b * dx + centerCircle.y);
        const tangent2 = new Vector(a * dx - b * dy + centerCircle.x, a * dy + b * dx + centerCircle.y);

        // Check if tangents are within maxDistance from viewpoint
        const distToTangent1 = Math.sqrt((tangent1.x - x) * (tangent1.x - x) + (tangent1.y - y) * (tangent1.y - y));
        const distToTangent2 = Math.sqrt((tangent2.x - x) * (tangent2.x - x) + (tangent2.y - y) * (tangent2.y - y));

        if (distToTangent1 <= maxDistance && distToTangent2 <= maxDistance) {
            return [tangent1, tangent2];
        } else if (distToTangent1 <= maxDistance) {
            return [tangent1];
        } else if (distToTangent2 <= maxDistance) {
            return [tangent2];
        } else {
            return undefined; // No valid tangents within maxDistance
        }
    }

    drawViewPoint(ctx: CanvasRenderingContext2D): void {
        const owner = this.owner;
        if (!owner) {
            console.warn('Skipped drawing because of lack of owner');
            return;
        }

        const pos = owner.pos;
        const centerX = pos.x;
        const centerY = pos.y;
        // const direction = owner.rotation;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;

        // let previousEdge: Vector = this.visibleEdges[this.visibleEdges.length - 1];
        // for (const edge of this.visibleEdges) {
        //     const triangle = new Path2D();
        //     triangle.moveTo(centerX, centerY);
        //     triangle.lineTo(previousEdge.x, previousEdge.y);
        //     triangle.lineTo(edge.x, edge.y);
        //     ctx.fill(triangle);
        //
        //     previousEdge = edge;
        // }

        for (const {
            // getAngle = (): number => ViewpointComponent.defaultAngle,
            getRange = (): number => ViewpointComponent.defaultRange,
            getFalloff = (): number => ViewpointComponent.defaultFalloff,
        } of this.viewPoints) {
            // const angle = getAngle();
            // const startAngle = direction - angle / 2;
            // const endAngle = direction + angle / 2;


            const range = getRange();
            ctx.fillStyle = this.posToGradient(
                ctx,
                pos,
                range,
                'rgba(0,0,0,0)',
                'rgba(0,0,0,1)',
                getFalloff()
            );

            let extraEdge: Vector | undefined;
            let previousEdge: Vector = this.visibleEdges[this.visibleEdges.length - 1].pos;
            for (const edge of this.visibleEdges) {
                const points = [pos, previousEdge];
                if (extraEdge) {
                    points.push(extraEdge);
                    extraEdge = undefined;
                }
                if (edge.extend) {
                    const extendedEdge = owner.pos.add(edge.pos.sub(owner.pos).normalize().scale(range));
                    const centerAngle = edge.object.pos.sub(owner.pos).toAngle();
                    if (centerAngle - edge.angle > 0) {
                        points.push(extendedEdge);
                        // this.drawPolygon(ctx, [pos, previousEdge, extendedEdge, edge.pos]);
                    } else {
                        extraEdge = extendedEdge;
                    }
                }
                points.push(edge.pos);

                this.drawPolygon(ctx, points);
                // const triangle = new Path2D();
                // triangle.moveTo(centerX, centerY);
                // triangle.lineTo(previousEdge.x, previousEdge.y);
                // triangle.lineTo(edge.pos.x, edge.pos.y);
                // ctx.fill(triangle);

                previousEdge = edge.pos;
            }

            for (const visibleActor of this.visibleActors) {
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
                } else if (collider instanceof PolygonCollider) {
                    this.drawPolygon(ctx, collider.bounds.getPoints());
                } else {
                    console.log('Unimplemented Collider type: ', collider);
                }
            }

            // ctx.beginPath();
            // ctx.moveTo(centerX, centerY);
            // ctx.arc(
            //     centerX,
            //     centerY,
            //     range,
            //     startAngle,
            //     endAngle,
            // );

            ctx.closePath();
            ctx.fill();
        }
    }

    protected drawPolygon(ctx: CanvasRenderingContext2D, points: Vector[]): void {
        const polygon = new Path2D();
        const firstPoint = points.shift();
        if (!firstPoint) {
            console.log('Empty points?');
            return;
        }

        polygon.moveTo(firstPoint.x, firstPoint.y);
        for (const point of points) {
            polygon.lineTo(point.x, point.y);
        }

        ctx.fill(polygon);
    }

    protected posToGradient(
        ctx: CanvasRenderingContext2D,
        pos: Vector,
        visionRadius: number,
        lightColor: string,
        darkColor: string,
        falloff: number,
    ): CanvasGradient {
        const gradient = ctx.createRadialGradient(pos.x, pos.y, visionRadius, pos.x, pos.y, visionRadius * falloff);
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(1, darkColor);

        return gradient;
    }

    public canSee(target: Actor): number {
        const owner = this.owner;
        if (!owner) {
            return 0;
        }

        let objectRadius: number | undefined;
        let objectArea: number | undefined;
        const collider = target.collider.get();
        if (collider === undefined) {
            // console.log('Undefined collider on:', target);
            return 1;
        }

        if (collider instanceof CircleCollider) {
            objectRadius = collider.radius;
            objectArea = Math.PI * objectRadius * objectRadius;
        } else if (collider instanceof PolygonCollider) {
            objectRadius = (collider.bounds.height + collider.bounds.height) / 4;
            objectArea = collider.bounds.height * collider.bounds.height;
        } else {
            console.error(collider);
            throw new Error('Unknown collider type');
        }

        // Calculate vector from player to object center
        const dx = target.pos.x - owner.pos.x;
        const dy = target.pos.y - owner.pos.y;

        // Calculate distance from player to object center
        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);

        // Calculate angle between player's orientation and the object center
        const angleToObject = Math.atan2(dy, dx);

        // Normalize the angle to be within [-PI, PI]
        const normalizedAngle = this.normalizeAngle(angleToObject - owner.rotation);

        // Calculate angle between player orientation and the edge of the circle
        const angleToEdge = Math.atan2(objectRadius, distanceToCenter);

        const minAngle = normalizedAngle - angleToEdge;
        const maxAngle = normalizedAngle + angleToEdge;

        // Normalize minAngle and maxAngle to be within [-PI, PI]
        const normalizedMinAngle = this.normalizeAngle(minAngle);
        const normalizedMaxAngle = this.normalizeAngle(maxAngle);

        let maxVisibility: number = 0;
        for (const {
            getAngle = (): number => ViewpointComponent.defaultAngle,
            getRange = (): number => ViewpointComponent.defaultRange,
        } of this.viewPoints) {
            // Check if object center is within max range
            if (distanceToCenter > getRange() + objectRadius) {
                continue; // Object is outside max range
            }

            const FOV = getAngle();

            // Calculate half-angle of the field of view
            const halfFOV = FOV / 2;

            // Calculate visible angle range
            const visibleAngleRange = Math.min(normalizedMaxAngle, halfFOV) - Math.max(normalizedMinAngle, -halfFOV);

            // Check if target is outside of field of view
            if (visibleAngleRange < 0) {
                continue;
            }

            const visibleFraction = visibleAngleRange / FOV;
            const visibleArea = visibleFraction * objectArea;
            const visiblePercentage = visibleArea / objectArea;

            maxVisibility = Math.max(maxVisibility, visiblePercentage);
        }

        // Clamp percentage to range [0, 1]
        return Math.max(0, Math.min(1, maxVisibility * 10));
    }

    private normalizeAngle(angle: number): number {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle <= -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
}