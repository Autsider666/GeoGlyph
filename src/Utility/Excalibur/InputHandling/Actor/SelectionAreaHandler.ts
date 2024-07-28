import {
    Actor,
    BoundingBox,
    Collider,
    Color,
    Engine,
    Entity,
    PointerButton,
    PointerType,
    PolygonCollider,
    Rectangle,
    Shape,
    Vector
} from "excalibur";
import {ColorPalette} from "../../../../IDE/ColorPalette.ts";
import {FriendlyTag} from "../../../../Magitek/Actor/tags.ts";
import {SelectedTag} from "../../ECS/Component/SelectableComponent.ts";

export class SelectionAreaHandler extends Actor {
    private readonly graphic: Rectangle;
    private readonly rectangularCollider: PolygonCollider;
    private dragStartPosition?: Vector;
    private selectableEntities: Set<Entity> = new Set<Entity>();

    constructor() {
        const collider = Shape.Box(0, 0, Vector.Zero);
        super({
            anchor: Vector.Zero,
            collider,
        });

        this.rectangularCollider = collider;

        this.graphic = new Rectangle({
            width: 0,
            height: 0,
            color: Color.Transparent,

            lineWidth: 5,
            strokeColor: ColorPalette.accentDarkColor,
        });

        this.graphics.visible = false;

        this.graphics.use(this.graphic);

        this.z = 250;
    }

    onInitialize(engine: Engine): void {
        const selectedQuery = engine.currentScene.world.queryTags([SelectedTag]);

        engine.input.pointers.primary.on('down', ({pointerType, button, worldPos}) => {
            if (pointerType !== PointerType.Mouse || button !== PointerButton.Left) {
                return;
            }

            this.dragStartPosition = worldPos.clone();
            this.pos = worldPos.clone();
            this.selectableEntities.clear();
        });

        engine.input.pointers.primary.on('up', ({pointerType, button}) => {
            if (pointerType !== PointerType.Mouse || button !== PointerButton.Left) {
                return;
            }

            this.dragStartPosition = undefined;
            this.graphics.visible = false;

            while (selectedQuery.entities.length !== 0) {
                for (const entity of selectedQuery.entities) {
                    entity.removeTag(SelectedTag);
                }
            }

            for (const entity of this.selectableEntities) {
                if (!entity.hasTag(FriendlyTag)) {
                    continue;
                }

                entity.addTag(SelectedTag);
            }

            this.rectangularCollider.points = [];
            this.rectangularCollider.flagDirty();

            this.selectableEntities.clear();
        });
    }

    onCollisionStart(_: Collider, other: Collider): void {
        this.selectableEntities.add(other.owner);
    }

    onCollisionEnd(_: Collider, other: Collider): void {
        this.selectableEntities.delete(other.owner);
    }

    onPreUpdate(engine: Engine): void {
        if (!this.dragStartPosition) {
            return;
        }


        const {x, y} = engine.input.pointers.primary.lastWorldPos.sub(this.dragStartPosition);
        if (x === 0 && y === 0) {
            this.graphics.visible = false;
            return;
        }

        this.graphic.width = x;
        this.graphic.width = x;
        this.graphic.height = y;

        this.anchor.setTo(x > 0 ? 0 : 1, y > 0 ? 0 : 1);

        this.rectangularCollider.points = BoundingBox.fromDimension(
            this.graphic.width,
            this.graphic.height,
            new Vector(x > 0 ? 0 : 1, y > 0 ? 0 : 1),
        ).getPoints();
        this.rectangularCollider.flagDirty();

        this.graphics.visible = true;
    }
}