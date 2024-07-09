import {ReactElement} from "react";
import {StatsPanel} from "../components/Graph/Panel/StatsPanel.tsx";
import {SigmaGraph} from "../components/Graph/SigmaGraph.tsx";
export const DisplayGraph = (): ReactElement => {
    return <>
        <SigmaGraph>
            <div className="panels">
                <StatsPanel/>
            </div>
        </SigmaGraph>
    </>;
};