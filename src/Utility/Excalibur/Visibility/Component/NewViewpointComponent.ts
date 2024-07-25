import {Actor, CircleCollider, Color, CompositeCollider, PolygonCollider, Vector} from "excalibur";
import {ArrayHelper} from "../../../ArrayHelper.ts";
import {CanvasHelper} from "../../../CanvasHelper.ts";
import {RadianHelper} from "../../../RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent, VisibilityEdge} from "./BlockVisibilityComponent.ts";

type ViewPointData = {
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}

type Edge = {
    // coordinate: Vector,
    // object: Actor,
    // isPolygon: boolean,
    // angle: number,
    // distance: number,
    // centerDiff: number,
    // extendable: boolean | Vector | null,
    color?: Color,
} & VisibilityEdge;

export class NewViewpointComponent extends BaseComponent implements ViewPoint {
    // private static defaultAngle: number = RadianHelper.Circle;
    private static defaultRange: number = Infinity;
    private static defaultFalloff: number = 0;
    private readonly initializedEntities = new Set<number>(); //TODO remove
    private previousPos?: Vector;

    private visibleEdges: Edge[] = [];

    constructor(
        private readonly viewPoints: ViewPointData[]
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        owner.on('preupdate', ({engine}) => {
            if (this.previousPos === undefined) {
                this.visibleEdges.length = 0;
                this.previousPos = owner.pos.clone();
            }

            if (this.visibleEdges.length > 0 && this.previousPos.equals(owner.pos)) {
                return;
            }

            this.previousPos.setTo(owner.pos.x, owner.pos.y);

            for (const child of owner.children) {
                if (child.hasTag('debugDraw')) {
                    child.unparent();
                }
            }

            this.visibleEdges = [];
            const visionBlockers = engine.currentScene.world.query([BlockVisibilityComponent]).entities;
            for (const visionBlocker of visionBlockers) {
                if (visionBlocker.id === owner.id || !(visionBlocker instanceof Actor) || this.initializedEntities.has(visionBlocker.id)) {
                    continue;
                }

                const visibleEdges = visionBlocker.get(BlockVisibilityComponent).getEdges(owner, false);

                for (const visibleEdge of visibleEdges) {
                    if (visibleEdge.marker) {
                        engine.add(visibleEdge.marker);
                    }
                }

                this.visibleEdges = this.visibleEdges.concat(visibleEdges);
            }

            this.visibleEdges = this.visibleEdges.sort((a: Edge, b: Edge) => {
                if (a.angle === b.angle) {
                    // console.log(a,b);
                    return 0;
                    // if (a.distance === b.distance) {
                    //     throw new Error('Ok, so we need edge filtering');
                    // }
                    //
                    // // if (a.centerDiff - b.centerDiff < 0) {
                    // //     return a.distance < b.distance ? -1 : 1;
                    // // }
                    // //
                    // // return a.distance > b.distance ? -1 : 1;
                    // throw new Error('Should never happen again.... right?');

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

            ctx.fill(this.generateVisibilityPolygon(owner));
        }
    }

    public drawVisibleActors(ctx: CanvasRenderingContext2D):void {
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
            } else if (collider instanceof CompositeCollider) {
                continue; //TODO draw composite collider?
            } else {
                console.log('Unimplemented Collider type: ', collider);
            }
        }
    }

    private generateVisibilityPolygon(owner: Actor): Path2D {

        let extraEdge: Vector | undefined;
        const polygon = new Path2D();
        for (const edge of this.visibleEdges) {
            if (extraEdge) {
                polygon.lineTo(extraEdge.x, extraEdge.y);
                extraEdge = undefined;
            }

            if (edge.extendable) {
                const edgePos = {
                    isTop: edge.collider.bounds.top === edge.coordinate.y,
                    isBottom: edge.collider.bounds.bottom === edge.coordinate.y,
                    isLeft: edge.collider.bounds.left === edge.coordinate.x,
                    isRight: edge.collider.bounds.right === edge.coordinate.x,
                    isHorizontal: edge.collider.bounds.top === edge.coordinate.y || edge.collider.bounds.bottom === edge.coordinate.y,
                    isVertical: edge.collider.bounds.left === edge.coordinate.x || edge.collider.bounds.right === edge.coordinate.x,
                };
                const directionToRange = edge.coordinate.sub(owner.pos);
                // const directionToRange = edge.coordinate.sub(owner.pos).normalize().scale(range);
                // const directionToRange = Vector.fromAngle(edge.angle); // Glitches while moving


                const hits = this.rayCast(owner.pos, directionToRange, {
                    // maxDistance: range + 1,
                    filter: hit => {
                        if (!hit.collider.owner.has(BlockVisibilityComponent) || edge.coordinate.equals(hit.point)) {
                            return false;
                        }
                        const hitPos = {
                            isTop: hit.collider.bounds.top === hit.point.y,
                            isBottom: hit.collider.bounds.bottom === hit.point.y,
                            isLeft: hit.collider.bounds.left === hit.point.x,
                            isRight: hit.collider.bounds.right === hit.point.x,
                            isHorizontal: hit.collider.bounds.top === hit.point.y || hit.collider.bounds.bottom === hit.point.y,
                            isVertical: hit.collider.bounds.left === hit.point.x || hit.collider.bounds.right === hit.point.x,
                        };

                        // Check if ray is horizontal to see if it should go past it
                        if (edge.coordinate.y === hit.point.y && (edgePos.isTop && hitPos.isTop || edgePos.isBottom && hitPos.isBottom)) {
                            return false;
                        }

                        // Check if ray is vertical to see if it should go past it
                        if (edge.coordinate.x === hit.point.x && (edgePos.isLeft && hitPos.isLeft || edgePos.isRight && hitPos.isRight)) {
                            return false;
                        }

                        return true;
                    },
                    searchAllColliders: false,
                });

                const extendedEdge = hits[0]?.point ?? owner.pos.add(directionToRange);

                const centerAngle = edge.object.pos.sub(owner.pos).toAngle();
                const angularDifference = centerAngle - edge.angle;
                if (Math.abs(angularDifference) < Math.PI ? angularDifference > 0 : angularDifference < 0) {
                    polygon.lineTo(extendedEdge.x, extendedEdge.y);
                } else {
                    extraEdge = extendedEdge;
                }
            }

            polygon.lineTo(edge.coordinate.x, edge.coordinate.y);
        }

        if (extraEdge) {
            polygon.lineTo(extraEdge.x, extraEdge.y);
        }

        return polygon;
    }
}