import {ReactElement} from "react";
import {BackgroundPattern} from "../components/BackgroundPattern.tsx";

export const TestSandbox = (): ReactElement => {
    return <BackgroundPattern
        type="Blueprint"
        typeSize={2}
        // backgroundColor={'#269'}
        backgroundColor={'transparent'}
        patternColor={'rgba(255,255,255, 0.1)'}
        // patternColor={'rgba(255,255,255, 0.50)'}
        patternSize={100}
    >
        {(style) => <div className="fullScreen" style={style}></div>}
    </BackgroundPattern>;
};