import {Actor, PointerEvent} from "excalibur";
import {BaseComponent} from "../BaseComponent.ts";

export class PointerClickToPositionComponent extends BaseComponent {
    private dragging: boolean = false;

    onAdd(owner: Actor): void {
        owner.once('postupdate', ({engine}) => {
            engine.input.pointers.primary.on('up', event => this.handlePointer(event, owner, false));
            // engine.input.pointers.primary.on('down', event => this.handlePointer(event, owner, true));
            // engine.input.pointers.primary.on('move', event => this.handlePointer(event, owner));
        });
    }

    private handlePointer({worldPos}: PointerEvent, owner: Actor, dragging?: boolean): void {
        if (dragging === undefined && !this.dragging) {
            return;
        }

        owner.pos.setTo(worldPos.x, worldPos.y);

        if (dragging !== undefined) {
            this.dragging = dragging;
        }
    }
}