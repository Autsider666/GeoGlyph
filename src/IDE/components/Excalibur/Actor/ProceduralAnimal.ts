import {Actor, Engine, Keys, Vector} from "excalibur";
import {ProceduralNode} from "./ProceduralNode.ts";

export class ProceduralAnimal extends Actor {
    private nodes: ProceduralNode[] = [];

    constructor(
        pos?: Vector,
        nodeCount: number = 15,
        private readonly defaultNodeDistance: number = 25,
        private readonly defaultNodeRadius: number = 25,
    ) {
        super({
            pos,
            // radius: 10,
            // color:Color.Red,
        });

        this.setNodeCount(nodeCount);
    }

    public setNodeCount(count: number): void {
        if (this.nodes.length === count) {
            return;
        }

        while (this.nodes.length !== count) {
            if (this.nodes.length > count) {
                const node = this.nodes.shift();
                if (node) {
                    this.removeChild(node);
                }

                if (this.nodes.length > 0) {
                    this.nodes[0].target = undefined;
                }
            } else {
                const node = new ProceduralNode(
                    new Vector(this.nodes.length * this.defaultNodeDistance, 0),
                    this.defaultNodeDistance,
                    this.defaultNodeRadius,
                    this.nodes[this.nodes.length - 1]
                );
                this.addChild(node);
                this.nodes.push(node);
            }

            const ignoreFirstNodes: number = Math.min(Math.max(1,this.nodes.length * 0.1),3);
            const radiusModifier = Math.max(this.defaultNodeRadius - 5, 5) / Math.max(1, this.nodes.length - ignoreFirstNodes);
            for (let i = 0; i < this.nodes.length; i++) {
                if (i < ignoreFirstNodes) {
                    this.nodes[i].setRadius(this.defaultNodeRadius);
                } else {
                    this.nodes[i].setRadius(this.defaultNodeRadius - radiusModifier * i);
                }
            }
        }
    }

    onInitialize(engine: Engine): void {
        engine.inputMapper.on(({keyboard}) => keyboard.wasReleased(Keys.Q), () => this.setNodeCount(Math.max(1, this.nodes.length - 1)));
        engine.inputMapper.on(({keyboard}) => keyboard.wasReleased(Keys.E), () => this.setNodeCount(Math.min(50, this.nodes.length + 1)));
    }

    onPreUpdate(engine: Engine): void {
        if (this.nodes.length === 0) {
            return;
        }

        this.nodes[0].pos = engine.input.pointers.primary.lastWorldPos.sub(this.pos);
    }
}