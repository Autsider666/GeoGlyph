import {Actor, ActorEvents, EventKey, Subscription} from "excalibur";
import {BaseComponent} from "../BaseComponent.ts";

export type OwnerHandler<EventType> = (event: EventType & {owner:Actor}) => void;

export abstract class LifeCycleListeningComponent extends BaseComponent {
    private readonly callbacks = new Map<EventKey<ActorEvents>, OwnerHandler<ActorEvents[EventKey<ActorEvents>]>[]>();

    private readonly subscriptions: Subscription[] = [];

    onAdd(owner: Actor): void {
        for (const event of this.callbacks.keys() as unknown as EventKey<ActorEvents>[]) {
            const handlers = this.callbacks.get(event) ?? [];
            for (const handler of handlers) {
                const subscription = owner.on(event, event => {
                    // @ts-expect-error Dirty but required.
                    event.owner = owner;
                    // @ts-expect-error Same here
                    handler(event);
                });
                this.subscriptions.push(subscription);
            }
        }
    }

    onRemove(): void {
        for (const subscription of this.subscriptions) {
            subscription.close();
        }
    }

    protected on<TEventName extends EventKey<ActorEvents>>(eventName: TEventName, handler: OwnerHandler<ActorEvents[TEventName]>): void {
        if (!this.callbacks.has(eventName)) {
            this.callbacks.set(eventName, []);
        }

        this.callbacks.get(eventName)?.push(handler as OwnerHandler<ActorEvents[EventKey<ActorEvents>]>);
    }
}