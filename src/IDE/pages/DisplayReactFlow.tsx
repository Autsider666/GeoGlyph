import {ReactFlowProvider,} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {ReactElement} from "react";
import {BackgroundPattern} from "../components/BackgroundPattern.tsx";
import {DnDFlow} from "../components/ReactFlow/DnDFlow.tsx";
import {SinkNodeToolBar} from "../components/ReactFlow/Node/SinkNode.tsx";
import {SourceNodeToolBar} from "../components/ReactFlow/Node/SourceNode.tsx";

export const DisplayReactFlow = (): ReactElement => {
    return <BackgroundPattern
        type="Blueprint"
        typeSize={2}
        // backgroundColor={'#269'}
        backgroundColor={'transparent'}
        patternColor={'rgba(255,255,255, 0.1)'}
        // patternColor={'rgba(255,255,255, 0.50)'}
        patternSize={100}
    >
        {(style) => <ReactFlowProvider>
            <DnDFlow style={style} customNodes={[SourceNodeToolBar, SinkNodeToolBar]}/>
        </ReactFlowProvider>}
    </BackgroundPattern>;
};