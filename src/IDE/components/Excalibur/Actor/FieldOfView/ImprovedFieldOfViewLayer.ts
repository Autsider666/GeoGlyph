import {Actor, Canvas, CircleCollider, PolygonCollider, Ray, Vector} from "excalibur";
import {FieldOfViewLayer} from "./FieldOfViewLayer.ts";
import {Player} from "./Player.ts";

export class ImprovedFieldOfViewLayer extends FieldOfViewLayer {
    private readonly objects: Actor[];

    constructor(
        players: Player[],
        objects: Actor[],
        {
            alpha = 1, //TODO was 0.75
            color = '#000000'
        }: {alpha?: number, color?:string} = {}
    ) {
        super(
            players,
            new Canvas({
                width: 500,
                height: 500,
                draw: (ctx): void => {
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = color;
                    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                    ctx.globalCompositeOperation = 'destination-out';

                    for (const player of this.players) {
                        const angles = this.calculateWallAngles(player, this.objects, player.fieldOfView, player.visionRadius);
                        const rays = this.castRays(player, angles, player.visionRadius);
                        this.fillTriangles(ctx, player.pos, rays);
                    }
                }
            }),
        );

        this.objects = objects.filter(object => !(object instanceof Player || object instanceof FieldOfViewLayer));
    }

    // onPreUpdate(): void {
    //     for (const player of this.players) {
    //         const angles = this.calculateWallAngles(player.pos, this.objects, player.fieldOfView, player.visionRadius);
    //         const rays = this.castRays(player.pos, angles, player.visionRadius);
    //         this.fillTriangles(player.pos, rays);
    //     }
    // }

    private calculateWallAngles(player: Player, objects: Actor[], fieldOfViewAngle: number, maxRange: number): number[] {
        const center = player.pos;
        const playerOrientation = player.direction.toAngle();

        let angles: number[] = [];

        // Add angles for walls
        objects.forEach(object => {
            const collider = object.collider.get();
            if (collider instanceof PolygonCollider) {
                // Calculate angles from polygon points
                const polygonPoints = collider.points;
                for (let i = 0; i < polygonPoints.length; i++) {
                    const p1 = polygonPoints[i];
                    const p2 = polygonPoints[(i + 1) % polygonPoints.length];
                    const angle1 = Math.atan2(p1.y - center.y, p1.x - center.x);
                    const angle2 = Math.atan2(p2.y - center.y, p2.x - center.x);
                    angles.push(angle1, angle2);
                }
            } else if (collider instanceof CircleCollider) {
                // Calculate angles from circle
                const circleCenter = collider.center;
                const radius = collider.radius;

                // Calculate the vector from center to circle center
                const dx = circleCenter.x - center.x;
                const dy = circleCenter.y - center.y;

                // Calculate the distance and direction to the circle center
                const distance = Math.sqrt(dx * dx + dy * dy);
                const direction = Math.atan2(dy, dx);

                // // Calculate player's relative direction to circle center
                // const playerDirection = direction - playerOrientation;

                // Calculate the angles based on the direction to the circle center
                const startAngle = direction - Math.asin(radius / distance);
                const endAngle = direction + Math.asin(radius / distance);

                angles.push(startAngle, endAngle);
            }
        });

        // // Add angles for field of view
        // const centerAngle = Math.atan2(center.y - center.y, center.x - center.x); // assuming the center is at (0, 0)
        // const halfAngle = fieldOfViewAngle / 2;
        // angles.push(centerAngle - halfAngle, centerAngle + halfAngle);

        // Add angles for field of view based on player's orientation
        const halfAngle = fieldOfViewAngle / 2;
        angles.push(playerOrientation - halfAngle, playerOrientation + halfAngle);

        // Filter angles within field of view and max range
        angles = angles.filter(angle => {
            const distance = Math.sqrt(Math.pow(center.x + maxRange * Math.cos(angle) - center.x, 2) + Math.pow(center.y + maxRange * Math.sin(angle) - center.y, 2));
            return angle >= playerOrientation - halfAngle && angle <= playerOrientation + halfAngle && distance <= maxRange;

        });

        // Sort angles in ascending order
        angles.sort((a, b) => a - b);

        return angles;

        // // Add angles for field of view
        // const halfAngle = fieldOfViewAngle / 2;
        // angles.push(centerAngle - halfAngle, centerAngle + halfAngle);
        //
        // // Sort angles in ascending order
        // angles.sort((a, b) => a - b);
        //
        // // Filter angles within field of view and max range
        // angles = angles.filter(angle => {
        //     const distance = Math.sqrt(Math.pow(center.x + maxRange * Math.cos(angle) - center.x, 2) + Math.pow(center.y + maxRange * Math.sin(angle) - center.y, 2));
        //     return angle >= centerAngle - halfAngle && angle <= centerAngle + halfAngle && distance <= maxRange;
        // });
        //
        // return angles;
    }

    private castRays(player: Player, angles: number[], maxRange: number): Vector[] {
        // Rays will be cast from the center at each angle within maxRange
        // return angles.map(angle => new Vector(
        //     center.x + maxRange * Math.cos(angle),
        //     center.y + maxRange * Math.sin(angle)
        // ));
        return angles.map(angle => {
            const ray = new Ray(player.pos, Vector.fromAngle(angle));
            const hits = this.scene?.physics.rayCast(ray, {
                maxDistance: maxRange,
                searchAllColliders: false,
                filter: hit => hit.collider.owner.id !== player.id,
            }) ?? [];

            return hits[0]?.point ?? new Vector(
                player.pos.x + maxRange * Math.cos(angle),
                player.pos.y + maxRange * Math.sin(angle)
            );
        });
    }

    private fillTriangles(ctx: CanvasRenderingContext2D, center: Vector, points: Vector[]): void {
        // Assuming points are ordered clockwise or counterclockwise
        const n = points.length;
        for (let i = 0; i < n - 1; i++) {
            // Create triangles with center point and adjacent points
            this.drawTriangle(ctx, center, points[i], points[i + 1]);
        }
        // Closing the loop with the last point
        this.drawTriangle(ctx, center, points[n - 1], points[0]);
    }

    private drawTriangle(ctx: CanvasRenderingContext2D, p1: Vector, p2: Vector, p3: Vector): void {
        if (p1 === undefined || p2 === undefined) {
            return; //TODO maybe don't draw 3th line?
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.stroke();
        // ctx.fillStyle = "red";
        // ctx.fill();
    }
}