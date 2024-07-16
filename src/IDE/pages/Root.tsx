import {ReactElement} from "react";
import {Outlet} from "react-router-dom";
import {MenuNavBar} from "../components/Menu/MenuNavBar.tsx";

export const Root = (): ReactElement => {
    return <>
        <MenuNavBar/>
        <Outlet/>
    </>;
};