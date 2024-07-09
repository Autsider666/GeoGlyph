import {ReactElement} from "react";
import {NavBar} from "../Bulma/NavBar.tsx";
import {MenuBrand} from "./MenuBrand.tsx";

export const MenuNavBar = (): ReactElement => {
    return <NavBar
        brand={<MenuBrand/>}
        start={[
            {key: 'graph', item: 'Graph', link: '/graph'},
        ]}
    />;
};