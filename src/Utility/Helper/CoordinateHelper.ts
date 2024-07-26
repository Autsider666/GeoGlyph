import {GenericVector} from "../Type/Coordinate.ts";

export class CoordinateHelper {
    public static getUniqueCoordinates<Coordinate extends GenericVector = GenericVector>(points: Coordinate[], decimals: number = 5): Coordinate[] {
        const visitedPoints = new Set<string>();
        return points.filter(function (points) {
            const key = points.x.toFixed(decimals) + "," + points.y.toFixed(decimals);
            if (visitedPoints.has(key)) {
                return false;
            }

            visitedPoints.add(key);
            return true;
        });
    }
}