import {Actor} from "excalibur";
import {ColorPalette} from "../../../../IDE/ColorPalette.ts";
import {SelectionMarker} from "../../Actor/SelectionMarker.ts";
import {BaseComponent} from "../BaseComponent.ts";

export const SelectedTag: string = 'SELECTED' as const;

export class SelectableComponent extends BaseComponent {
    private readonly selectedCircle: SelectionMarker;

    constructor(private selected: boolean = false) {
        super();

        this.selectedCircle = new SelectionMarker({
            animationGrowth: 2,
            animationSpeed: 2,
            dashes: [5],
            color: ColorPalette.accentDarkColor
        });
    }

    onAdd(owner: Actor): void {
        if (this.selected) {
            this.updateSelection();
        }

        owner.on('pointerup', this.handleActorClick.bind(this));
        owner.on('preupdate', this.onPreUpdate.bind(this));
    }

    onRemove(previousOwner: Actor): void {
        previousOwner.removeTag(SelectedTag);
        previousOwner.removeChild(this.selectedCircle);
        previousOwner.off('pointerup', this.handleActorClick.bind(this));
        previousOwner.off('preupdate', this.onPreUpdate.bind(this));
    }

    public updateSelection(selected: boolean = true): void {
        this.selected = selected;
        if (this.selected) {
            this.owner?.addChild(this.selectedCircle);
            this.owner?.addTag(SelectedTag);
        } else {
            this.owner?.removeChild(this.selectedCircle);
            this.owner?.removeTag(SelectedTag);
        }
    }

    private onPreUpdate(): void {
        const isSelected: boolean = this.owner?.hasTag(SelectedTag) ?? false;
        if (this.selected === isSelected) {
            return;
        }

        this.updateSelection(isSelected);
    }

    private handleActorClick(): void {
        if (this.selected) {
            return;
        }

        this.updateSelection();
    }
}