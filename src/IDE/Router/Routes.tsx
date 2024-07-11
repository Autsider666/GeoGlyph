import {RouteObject} from "react-router-dom";
import {FasIconType} from "../components/Bulma/FasIcon.tsx";
import {DisplayReactDiagram} from "../pages/DisplayReactDiagram.tsx";
import {DisplayGraph} from "../pages/DisplayGraph.tsx";
import Home from "../pages/Home.tsx";
import {TestSandbox} from "../pages/TestSandbox.tsx";

type Route = {
    menu?: {
        name: string,
        type: 'brand'|'start'|'end',
        icon?: FasIconType,
    }
} & RouteObject

export const Routes: Route[] = [
    {
        menu: {
          name: 'GeoGlyph',
          type: 'brand',
          icon: 'fa-globe',
        },
        path: '',
        element: <Home/>
    },
    {
        menu: {
            name: 'Graph',
            type: 'start',
        },
        path: 'graph',
        element: <DisplayGraph/>
    },
    {
        menu: {
            name: 'Display',
            type: 'start',
        },
        path: 'diagram',
        element: <DisplayReactDiagram/>
    },
    {
        menu: {
            name: 'Test Sandbox',
            type: 'end',
        },
        path: 'test',
        element: <TestSandbox/>
    },
];
