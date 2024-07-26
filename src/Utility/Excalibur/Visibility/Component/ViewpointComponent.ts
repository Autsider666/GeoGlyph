import {Actor, Vector} from "excalibur";
import {CanvasHelper} from "../../../Helper/CanvasHelper.ts";
import {CoordinateHelper} from "../../../Helper/CoordinateHelper.ts";
import {RadianHelper} from "../../../Helper/RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {ColliderHelper} from "../../Utility/ColliderHelper.ts";
import {ViewPoint} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent, VisibilityEdge} from "./BlockVisibilityComponent.ts";

type ViewPointData = {
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}

export class ViewpointComponent extends BaseComponent implements ViewPoint {
    private static defaultAngle: number = RadianHelper.Circle;
    private static defaultRange: number = Infinity;
    private static defaultFalloff: number = 0;
    private readonly initializedEntities = new Set<number>(); //TODO remove

    private readonly visibleEdges: VisibilityEdge[] = [];
    private readonly points: Vector[] = [];

    constructor(
        private readonly viewPoints: ViewPointData[],
        private readonly disableRendering: boolean = false,
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
                    return 0;
                }

                return a.angle < b.angle ? -1 : 1;
            }));
        });
    }

    public drawViewPoint(ctx: CanvasRenderingContext2D): void {
        if (this.disableRendering) {
            return;
        }

        const owner = this.owner;
        if (!owner) {
            console.warn('Skipped drawing because of lack of owner');
            return;
        }

        const pos = owner.pos;
        const direction = owner.rotation;

        // ctx.globalCompositeOperation = 'destination-out';
        // ctx.globalAlpha = 1;

        // ctx.save();
        // const viewCone = new Path2D();
        for (const {
            getAngle = (): number => ViewpointComponent.defaultAngle,
            getRange = (): number => ViewpointComponent.defaultRange,
            getFalloff = (): number => ViewpointComponent.defaultFalloff,
        } of this.viewPoints) {
            const angle = getAngle();
            const startAngle = direction - angle / 2;
            const endAngle = direction + angle / 2;


            const range = getRange();
            ctx.fillStyle = CanvasHelper.posToReverseGradient(
                ctx,
                pos,
                range,
                'rgba(0,0,0,0)', // Dark outside
                'rgba(0,0,0,1)', // Light inside
                getFalloff()
            );

            // const gradient = ctx.createRadialGradient(pos.x, pos.y, range, pos.x, pos.y, 0);
            // gradient.addColorStop(0.0, "rgba(0,0,0,0.0)");
            // gradient.addColorStop(0.7, "rgba(0,0,0,0.7)");
            // gradient.addColorStop(0.9, "rgba(0,0,0,1.0)");
            //
            // ctx.fillStyle = gradient;

            ctx.save();
            const viewCone = new Path2D();
            // ctx.fillStyle = 'rgba(0,0,0,1)';
            viewCone.moveTo(pos.x,pos.y);
            viewCone.arc(
                pos.x,
                pos.y,
                range,
                startAngle,
                endAngle,
            );


            ctx.clip(viewCone);
            ctx.fill(this.createPolygonUsingOffsetAngles(owner));
            ctx.restore();
        }
    }

    private createPolygonUsingOffsetAngles(owner: Actor): Path2D {
        //Don't put this above +- 0.00001, because it will mess up long distance raycasting
        //Don't put it below +- 0.000001, because it seems to mess up short distance raycasting (use new Vector(180, 400))
        const offset = 0.000001;
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
            const direction = Vector.fromAngle(angle);
            const hit = this.rayCast(owner.pos, direction, {
                searchAllColliders: true, // KEEP AT TRUE TILL FIXED IN EX!!!!!
                filter: hit => hit.collider.owner.has(BlockVisibilityComponent),
            })[0];

            if (!hit) {
                const maxRangePoint = owner.pos.add(direction.scale(1000)); //TODO max range?
                hitsByAngle.push(maxRangePoint);
                continue;
            }

            if (!this.disableRendering) {
                hit.collider.owner.get(BlockVisibilityComponent).seen();
            }

            hitsByAngle.push(hit.point);
        }

        const polygon = new Path2D();
        if (hitsByAngle.length > 0) {
            const {x, y} = hitsByAngle[hitsByAngle.length - 1];
            polygon.moveTo(x, y);
            for (const point of hitsByAngle) {
                polygon.lineTo(point.x, point.y);
            }
        }

        return polygon;
    }
}