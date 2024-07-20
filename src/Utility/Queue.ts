export class Queue<T> {
    private readonly items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);
    }

    peek(): T | undefined {
        return this.items[0];
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}