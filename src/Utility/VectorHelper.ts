import {Vector} from "excalibur";

export class VectorHelper {
    public static getUniqueCoordinates(points: Vector[]): Vector[] {
        const visitedPoints = new Set<string>();
        return points.filter(function (points) {
            const key = points.x + "," + points.y;
            if (visitedPoints.has(key)) {
                return false;
            }

            visitedPoints.add(key);
            return true;
        });
    }
}