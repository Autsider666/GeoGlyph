import {Actor, PreUpdateEvent, Subscription} from "excalibur";
import {BaseComponent} from "./BaseComponent.ts";

export abstract class PreUpdateListeningComponent extends BaseComponent {
    private subscription?: Subscription;

    abstract onPreUpdate(event: PreUpdateEvent): void;

    onAdd(owner: Actor): void {
        this.subscription = owner.on('preupdate', this.onPreUpdate.bind(this));
    }

    onRemove(): void {
        this.subscription?.close();
    }
}