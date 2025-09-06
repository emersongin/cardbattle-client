export class ArrayUtil {
    static shuffle<T>(array: T[]): T[] {
        array.sort(() => Math.random() - 0.5);
        return array;
    }

    static clone<T>(array: T[]): T[] {
        return array.slice();
    }
}