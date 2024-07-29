import {Actor, Query, Vector} from "excalibur";
import {DirtyTag} from "../../../../Magitek/Actor/tags.ts";
import {CanvasHelper} from "../../../Helper/CanvasHelper.ts";
import {CoordinateHelper} from "../../../Helper/CoordinateHelper.ts";
import {RadianHelper} from "../../../Helper/RadianHelper.ts";
import {BaseComponent} from "../../ECS/BaseComponent.ts";
import {DirtyComponent} from "../../ECS/Component/DirtyComponent.ts";
import {ViewPoint, ViewPointModifiers} from "../../Utility/ViewPoint.ts";
import {BlockVisibilityComponent} from "./BlockVisibilityComponent.ts";

export class ViewpointComponent extends BaseComponent implements ViewPoint {
    private static readonly getDefaultInsideAlpha: () => number = () => 1;
    private static readonly getDefaultOutsideAlpha: () => number = () => 0;
    private static readonly getDefaultAngle: () => number = () => RadianHelper.Circle;
    private static readonly getDefaultRange: () => number = () => Infinity;
    private static readonly getDefaultFalloff: () => number = () => 0;
    private useCache: boolean = false;

    private readonly points: Vector[] = [];

    private visibilityBlockerQuery?: Query<typeof BlockVisibilityComponent>;

    private readonly viewPoints: (ViewPointModifiers & { cachedPath?: Path2D })[];

    constructor(
        viewPoints: ViewPointModifiers[],
        private readonly disableRendering: boolean = false,
    ) {
        super();

        this.viewPoints = viewPoints;
    }

    onAdd(owner: Actor): void {
        if (!owner.has(DirtyComponent)) {
            owner.addComponent(new DirtyComponent());
        }

        owner.on('preupdate', ({engine}) => {
            if (!this.visibilityBlockerQuery) {
                this.visibilityBlockerQuery = engine.currentScene.world.query([BlockVisibilityComponent]);
            }

            this.useCache = !owner.hasTag(DirtyTag);

            this.points.length = 0;
            const visionBlockers = this.visibilityBlockerQuery.entities;
            for (const visionBlocker of visionBlockers) {
                if (visionBlocker.id === owner.id) {
                    continue;
                }

                if (visionBlocker.hasTag(DirtyTag)) {
                    this.useCache = false;
                }

                this.points.push(...visionBlocker.get(BlockVisibilityComponent).getEdges(owner));
            }
        });
    }

    public drawViewPoint(
        ctx: CanvasRenderingContext2D,
        defaultModifiers: ViewPointModifiers,
    ): void {
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
        for (const viewpoint of this.viewPoints) {
            const {
                getAngle = defaultModifiers.getAngle ?? ViewpointComponent.getDefaultAngle,
                getRange = defaultModifiers.getRange ?? ViewpointComponent.getDefaultRange,
                getFalloff = defaultModifiers.getFalloff ?? ViewpointComponent.getDefaultFalloff,
                getInsideAlpha = defaultModifiers.getInsideAlpha ?? ViewpointComponent.getDefaultInsideAlpha,
                getOutsideAlpha = defaultModifiers.getOutsideAlpha ?? ViewpointComponent.getDefaultOutsideAlpha,
            } = viewpoint;

            const angle = getAngle();
            const startAngle = direction - angle / 2;
            const endAngle = direction + angle / 2;
            const insideAlpha = getInsideAlpha();
            const outsideAlpha = getOutsideAlpha();

            ctx.save();
            const range = getRange();
            ctx.fillStyle = CanvasHelper.posToReverseGradient(
                ctx,
                pos,
                range,
                `rgba(0,0,0,${outsideAlpha})`, // Dark outside
                `rgba(0,0,0,${insideAlpha})`, // Light inside
                getFalloff()
            );

            // const gradient = ctx.createRadialGradient(pos.x, pos.y, range, pos.x, pos.y, 0);
            // gradient.addColorStop(0.0, "rgba(0,0,0,0.0)");
            // gradient.addColorStop(0.7, "rgba(0,0,0,0.7)");
            // gradient.addColorStop(0.9, "rgba(0,0,0,1.0)");
            //
            // ctx.fillStyle = gradient;

            const viewCone = new Path2D();
            // ctx.fillStyle = 'rgba(0,0,0,1)';
            viewCone.moveTo(pos.x, pos.y);
            viewCone.arc(
                pos.x,
                pos.y,
                range,
                startAngle,
                endAngle,
            );

            ctx.clip(viewCone);
            if (!this.useCache || !viewpoint.cachedPath) {
                viewpoint.cachedPath = this.createPolygonUsingOffsetAngles(owner);
            }

            ctx.fill(viewpoint.cachedPath);

            ctx.fill();
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
                // angle, // TODO check if this one can be removed
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