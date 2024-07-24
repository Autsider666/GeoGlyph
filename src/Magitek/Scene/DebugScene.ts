import {Actor, CollisionStartEvent, CollisionType, Color, Engine, Scene} from "excalibur";

const objects: Actor[] = [
    new Actor({
        name: 'Bottom Right',
        x: 350,
        y: 450,
        width: 100,
        height: 100,
        color: Color.Green,
    }),
    new Actor({
        name: 'Center Right',
        x: 350,
        y: 250,
        width: 100,
        height: 100,
        color: Color.Gray,
    }),
    new Actor({
        name: 'Top Right',
        x: 350,
        y: 50,
        width: 100,
        height: 100,
        color: Color.Pink,
    }),
];

export class DebugScene extends Scene {
    onInitialize(engine: Engine): void {
        const circle = new Actor({
            name: 'Collision Circle',
            x: 250,
            y: 250,
            radius: 200,
            color: Color.Blue,
        });

        engine.add(circle);

        for (const object of objects) {
            engine.add(object);

            object.on('collisionstart', this.handleCollisionStart.bind(this));
        }

        engine.add(new Actor({
            name: 'Rectangle Collider',
            x: 400,
            y: 500,
            width: 100,
            height: 100,
            color: Color.Orange,
        }));
    }

    private handleCollisionStart(event: CollisionStartEvent): void {
        const {contact} = event;
        let i = 1;
        for (const point of contact.points) {
            const collisionPoint = new Actor({
                name: `Collision Point #${i++} between ${contact.colliderA.owner.name} and ${contact.colliderB.owner.name}`,
                pos: point,
                collisionType: CollisionType.PreventCollision,
                radius: 5,
                color: Color.Red,
            });

            console.log(collisionPoint.name, point);

            this.engine.add(collisionPoint);
        }
    }
}