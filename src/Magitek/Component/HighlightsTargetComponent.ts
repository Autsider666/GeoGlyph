import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {HasTargetComponent} from "../../Utility/Excalibur/ECS/Component/HasTargetComponent.ts";
import {SelectedTag} from "../../Utility/Excalibur/ECS/Component/SelectableComponent.ts";
import {PreUpdateListeningComponent} from "../../Utility/Excalibur/ECS/PreUpdateListeningComponent.ts";
import {SelectionMarker} from "../../Utility/Excalibur/InputHandling/Actor/SelectionMarker.ts";

export class HighlightsTargetComponent extends PreUpdateListeningComponent {
    private readonly marker: SelectionMarker;

    constructor() {
        super();

        this.marker = new SelectionMarker({
            color: ColorPalette.accentLightColor,
        });
    }

    onPreUpdate(): void {
        const target = this.owner?.get(HasTargetComponent)?.target;
        if (!target) {
            if (this.marker.parent) {
                this.marker.unparent();
            }

            return;
        }

        this.marker.changeColor(this.owner?.hasTag(SelectedTag) ? ColorPalette.accentDarkColor : ColorPalette.accentLightColor);

        if (target.id === this.marker.parent?.id) {
            return;
        }

        this.marker.unparent();
        target.addChild(this.marker);
    }

}