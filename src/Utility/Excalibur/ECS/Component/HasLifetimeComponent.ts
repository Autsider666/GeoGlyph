import {PreUpdateEvent} from "excalibur";
import {PreUpdateListeningComponent} from "../PreUpdateListeningComponent.ts";

export class HasLifetimeComponent extends PreUpdateListeningComponent {
    constructor(private remainingLifetime: number) {
        super();
    }

    onPreUpdate({delta}: PreUpdateEvent): void {
        this.remainingLifetime -= delta;
        if (this.remainingLifetime <= 0) {
            this.owner?.kill();
        }
    }

    reset(lifetime: number): void {
        this.remainingLifetime = lifetime;
    }
}