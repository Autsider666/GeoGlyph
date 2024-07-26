import {Actor, Vector} from "excalibur";
import {CanvasHelper} from "../../../Helper/CanvasHelper.ts";
import {CoordinateHelper} from "../../../Helper/CoordinateHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ColliderHelper} from "../../Utility/ColliderHelper.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent, VisibilityEdge} from "./BlockVisibilityComponent.ts";

type ViewPointData = {
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}


export class NewViewpointComponent extends BaseComponent implements ViewPoint {
    // private static defaultAngle: number = RadianHelper.Circle;
    private static defaultRange: number = Infinity;
    private static defaultFalloff: number = 0;
    private readonly initializedEntities = new Set<number>(); //TODO remove

    private readonly visibleEdges: VisibilityEdge[] = [];
    private readonly points: Vector[] = [];

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

            this.points.length = 0;
            const visibleEdges: VisibilityEdge[] = [];
            const visionBlockers = engine.currentScene.world.query([BlockVisibilityComponent]).entities;
            for (const visionBlocker of visionBlockers) {
                if (visionBlocker.id === owner.id || !(visionBlocker instanceof Actor) || this.initializedEntities.has(visionBlocker.id)) {
                    continue;
                }

                visibleEdges.push(...visionBlocker.get(BlockVisibilityComponent).getEdges(owner, false));
                this.points.push(...ColliderHelper.getColliderPoints(visionBlocker.collider.get(), {viewpoint: owner.pos}));
            }

            for (const visibleEdge of visibleEdges) {
                if (visibleEdge.marker) {
                    engine.add(visibleEdge.marker);
                }
            }

            this.visibleEdges.length = 0;

            this.visibleEdges.push(...visibleEdges.sort((a: VisibilityEdge, b: VisibilityEdge) => {
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
            }));
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
            ctx.fillStyle = CanvasHelper.posToReverseGradient(
                ctx,
                pos,
                range,
                'rgba(0,0,0,0)', // Dark outside
                'rgba(0,0,0,0.50)', // Light inside
                getFalloff()
            );

            // ctx.fillStyle = CanvasHelper.posToGradient(
            //     ctx,
            //     pos,
            //     range,
            //     [
            //         'rgba(0,0,0,0)',
            //         'rgba(0,0,0,0.10)',
            //         'rgba(0,0,0,0.25)',
            //         'rgba(0,0,0,0.45)',
            //         'rgba(0,0,0,0.60)',
            //         'rgba(0,0,0,0.90)',
            //     ],
            //     getFalloff()
            // );

            ctx.fill(this.generatePolygonUsingOffsetAngles(owner));
            // ctx.fill(this.generateVisibilityPolygon(owner));
        }
    }

    private generatePolygonUsingOffsetAngles(owner: Actor): Path2D {
        //Don't put this above +- 0.00001, because it will mess up long distance raycasting
        //Don't put it below +- 0.000001, because it seems to mess up short distance raycasting (use new Vector(180, 400))
        const offset = 0.000001;

        // console.log('---- Draw ----');
        // const target: string | undefined = 'Bottom Left';
        // const points = this.visibleEdges.map(edge => {
        //     // if (edge.object.name === target) {
        //     //     const direction = edge.coordinate.sub(owner.pos);
        //     //     const normalizedDirection = direction.normalize();
        //     //     const angle = normalizedDirection.toAngle();
        //     //     const angleDirection = Vector.fromAngle(angle);
        //     //     const angleDirectionAtRange = angleDirection.scale(edge.coordinate.distance(owner.pos));
        //     //     const hits = this.rayCast(owner.pos, Vector.fromAngle(angle - offset), {
        //     //         searchAllColliders: false,
        //     //         filter: hit => {
        //     //             if (!hit.collider.owner.has(BlockVisibilityComponent)) {
        //     //                 return false;
        //     //             }
        //     //
        //     //             console.log(hit.collider.owner.name, hit.point, hit);
        //     //
        //     //             return true;
        //     //         },
        //     //     });
        //     //     console.log('+++ results +++');
        //     //     console.log({
        //     //         coordinate: edge.coordinate,
        //     //         direction,
        //     //         normalizedDirection,
        //     //         angle,
        //     //         angleDirection,
        //     //         angleDirectionAtRange,
        //     //         hits,
        //     //         hit: hits[0].collider.owner.name,
        //     //     });
        //     // }
        //
        //     return edge.coordinate;
        // });
        // const uniquePoints = CoordinateHelper.getUniqueCoordinates(points);
        const uniquePoints = CoordinateHelper.getUniqueCoordinates(this.points);

        let uniqueAngles: number[] = [];
        for (const point of uniquePoints) {
            const angle = point.sub(owner.pos).toAngle();
            uniqueAngles.push(
                angle - offset,
                angle, // TODO check if this one can be removed
                angle + offset,
            );
        }

        uniqueAngles = uniqueAngles.sort();

        const hitsByAngle: Vector[] = [];
        for (const angle of uniqueAngles) {
            // console.log('angle',angle);
            const hit = this.rayCast(owner.pos, Vector.fromAngle(angle), {
                searchAllColliders: true, // KEEP AT TRUE TILL FIXED IN EX!!!!!
                filter: hit => hit.collider.owner.has(BlockVisibilityComponent),
                // filter: hit => {
                //     if (!hit.collider.owner.has(BlockVisibilityComponent)) {
                //         return false;
                //     }
                //
                //     if (hit.collider.owner.name === target) {
                //         console.log('Hit', angle, hit.point, hit);
                //     }
                //
                //     return true;
                // },
            })[0];

            if (!hit) {
                continue;
            }

            hit.collider.owner.get(BlockVisibilityComponent).seen();

            hitsByAngle.push(hit.point);
        }

        // hitsByAngle = hitsByAngle.sort((a, b) => a.angle - b.angle);

        // hitsByAngle = CoordinateHelper.getUniqueCoordinates(hitsByAngle, 4);

        const polygon = new Path2D();
        const {x, y} = hitsByAngle[hitsByAngle.length - 1];
        polygon.moveTo(x, y);
        for (const point of hitsByAngle) {
            polygon.lineTo(point.x, point.y);
        }

        return polygon;
    }

    // private generateVisibilityPolygon(owner: Actor): Path2D {
    //     // console.log('----------------');
    //     let prependableEdge: Vector | undefined;
    //     const polygon = new Path2D();
    //     for (const edge of this.visibleEdges) {
    //         if (prependableEdge) {
    //             polygon.lineTo(prependableEdge.x, prependableEdge.y);
    //             prependableEdge = undefined;
    //         }
    //
    //         if (edge.extendable) {
    //             // if (edge.object.name === 'Top Left') {
    //             //     console.log(`++++ ${edge.coordinate} ++++`);
    //             // }
    //
    //             const edgePos = {
    //                 isTop: edge.collider.bounds.top === edge.coordinate.y,
    //                 isBottom: edge.collider.bounds.bottom === edge.coordinate.y,
    //                 isLeft: edge.collider.bounds.left === edge.coordinate.x,
    //                 isRight: edge.collider.bounds.right === edge.coordinate.x,
    //             };
    //             const directionToRange = edge.coordinate.sub(owner.pos);
    //             // const directionToRange = edge.coordinate.sub(owner.pos).normalize().scale(range);
    //             // const directionToRange = Vector.fromAngle(edge.angle); // Glitches while moving
    //
    //             const hits = this.rayCast(owner.pos, directionToRange, {
    //                 // maxDistance: range + 1,
    //                 filter: hit => {
    //                     // if (edge.object.name === 'Top Left') {
    //                     //     console.log(hit.point, hit.collider.owner.name, hit);
    //                     // }
    //
    //                     //TODO exclude Screen boundary so visibility is still calculated when used is offscreen?
    //                     if (!hit.collider.owner.has(BlockVisibilityComponent) || edge.coordinate.equals(hit.point)) {
    //                         return false;
    //                     }
    //                     const hitPos = {
    //                         isTop: hit.collider.bounds.top === hit.point.y,
    //                         isBottom: hit.collider.bounds.bottom === hit.point.y,
    //                         isLeft: hit.collider.bounds.left === hit.point.x,
    //                         isRight: hit.collider.bounds.right === hit.point.x,
    //                     };
    //
    //                     // Check if ray is horizontal to see if it should go past it
    //                     if (edge.coordinate.y === hit.point.y && (edgePos.isTop && hitPos.isTop || edgePos.isBottom && hitPos.isBottom)) {
    //                         return false;
    //                     }
    //
    //                     // Check if ray is vertical to see if it should go past it
    //                     if (edge.coordinate.x === hit.point.x && (edgePos.isLeft && hitPos.isLeft || edgePos.isRight && hitPos.isRight)) {
    //                         return false;
    //                     }
    //
    //                     return true;
    //                 },
    //                 searchAllColliders: true,
    //             });
    //
    //             // if (edge.object.name === 'Top Left') {
    //             //     console.log(edge.coordinate, hits);
    //             // }
    //
    //             edge.object.get(BlockVisibilityComponent).seen();
    //
    //             if (hits.length > 0) {
    //                 const extendedEdge = hits[0]?.point;// ?? owner.pos.add(directionToRange);
    //                 const centerAngle = edge.object.pos.sub(owner.pos).toAngle();
    //                 const angularDifference = centerAngle - edge.angle;
    //                 if (Math.abs(angularDifference) < Math.PI ? angularDifference > 0 : angularDifference < 0) {
    //                     polygon.lineTo(extendedEdge.x, extendedEdge.y);
    //                 } else {
    //                     prependableEdge = extendedEdge;
    //                 }
    //             } else {
    //                 console.log('No hits?');
    //             }
    //         }
    //
    //         polygon.lineTo(edge.coordinate.x, edge.coordinate.y);
    //     }
    //
    //     if (prependableEdge) {
    //         polygon.lineTo(prependableEdge.x, prependableEdge.y);
    //     }
    //
    //     return polygon;
    // }
}