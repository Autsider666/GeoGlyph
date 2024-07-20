import {Actor, Rectangle, Vector} from "excalibur";
import {ColorPalette} from "../../IDE/ColorPalette.ts";
import {ProceduralNode} from "../../IDE/components/Excalibur/Actor/ProceduralAnimation/ProceduralNode.ts";
import {PreUpdateListeningComponent} from "../../Utility/Excalibur/ECS/PreUpdateListeningComponent.ts";
import {EnemyTag} from "../Actor/tags.ts";

export class SegmentedComponent extends PreUpdateListeningComponent {
    private readonly segments: ProceduralNode[] = [];

    constructor(
        private readonly segmentCount: number,
        private readonly segmentSize: number,
        private readonly segmentDistance: number,
    ) {
        super();
    }

    onAdd(owner: Actor): void {
        super.onAdd(owner);

        owner.once('preupdate', ({engine}) => {
            if (this.segments.length === this.segmentCount) {
                return;
            }

            while (this.segments.length !== this.segmentCount) {
                if (this.segments.length > this.segmentCount) {
                    const node = this.segments.shift();
                    if (node) {
                        engine.currentScene.remove(node);
                    }

                    if (this.segments.length > 0) {
                        this.segments[0].target = undefined;
                    }
                } else {
                    const segment = new ProceduralNode(
                        new Vector(this.segments.length * this.segmentDistance, 0),
                        this.segmentDistance,
                        this.segmentSize,
                        this.segments[this.segments.length - 1],
                        new Rectangle({
                            width: this.segmentSize,
                            height: this.segmentSize,
                            color: ColorPalette.backgroundDarkColor,
                            lineWidth: 3,
                            strokeColor: ColorPalette.accentDarkColor,
                        })
                    );

                    segment.addTag(EnemyTag);

                    engine.currentScene.add(segment);
                    this.segments.push(segment);
                }

                const ignoreFirstNodes: number = Math.min(Math.max(1, this.segments.length * 0.1), 3);
                const radiusModifier = Math.max(this.segmentSize - 5, 5) / Math.max(1, this.segments.length - ignoreFirstNodes);
                for (let i = 0; i < this.segments.length; i++) {
                    if (i < ignoreFirstNodes) {
                        this.segments[i].setRadius(this.segmentSize);
                    } else {
                        this.segments[i].setRadius(this.segmentSize - radiusModifier * i);
                    }
                }
            }
        });
    }

    onPreUpdate(): void {
        const owner = this.owner;
        if (!owner) {
            return;
        }

        if (this.segments.length === 0) {
            return;
        }

        this.segments[0].pos = owner.pos;
    }
}