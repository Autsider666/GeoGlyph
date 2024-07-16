import {ReactElement} from "react";
import {BackgroundPattern} from "../components/BackgroundPattern.tsx";
import {StatsPanel} from "../components/Graph/Panel/StatsPanel.tsx";
import {SigmaGraph} from "../components/Graph/SigmaGraph.tsx";

export const DisplayGraph = (): ReactElement => {
    return <BackgroundPattern
        type="CrossDots"
        typeSize={2}
        backgroundColor={'#269'}
        patternColor={'rgba(255,255,255, 0.50)'}
        patternSize={25}
    >
        {(style) => <div className="fullScreen" style={style}>
            <SigmaGraph>
                <div className="panels">
                    <StatsPanel initializeExpanded/>
                </div>
            </SigmaGraph>
        </div>}
    </BackgroundPattern>;
};