export class ArrayHelper {
    public static onlyUnique<T>(items: T[]): T[] {
        return items.filter((value: T, index: number, array: T[]): boolean => array.indexOf(value) === index);
    }
}