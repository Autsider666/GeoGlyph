import createEngine, {
    CanvasWidget,
    DefaultLinkModel,
    DefaultNodeModel,
    DiagramModel
} from "@projectstorm/react-diagrams";
import {ReactElement} from "react";

export const DisplayReactDiagram = (): ReactElement => {
    //1) setup the diagram engine
    const engine = createEngine();

    //2) setup the diagram model
    const model = new DiagramModel();

    //3-A) create a default node
    const node1 = new DefaultNodeModel({
        name: 'Node 1',
        color: 'rgb(0,192,255)'
    });
    node1.setPosition(100, 100);
    const port1 = node1.addOutPort('Out');

    //3-B) create another default node
    const node2 = new DefaultNodeModel('Node 2', 'rgb(192,255,0)');
    const port2 = node2.addInPort('In');
    node2.setPosition(400, 100);

    // link the ports
    const link1 = port1.link<DefaultLinkModel>(port2);
    link1.getOptions().testName = 'Test';
    link1.addLabel('Hello World!');

    //4) add the models to the root graph
    model.addAll(node1, node2, link1);

    //5) load model into engine
    engine.setModel(model);

    return <div className="diagram fullScreen pattern test">
        <CanvasWidget engine={engine}/>
    </div>;
};