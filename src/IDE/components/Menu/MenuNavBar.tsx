import {ReactElement} from "react";
import {Routes} from "../../Router/Routes.tsx";
import {NavBar} from "../Bulma/NavBar.tsx";
import {MenuItem} from "./MenuItem.tsx";

const generateElementsFor = (type: string): ReactElement[] => Routes.filter(route => route.menu?.type === type)
    .map(({menu, path}) => menu && path !== undefined ?
        <MenuItem key={menu.name} name={menu.name} to={path} icon={menu.icon}/> : undefined)
    .filter(element => element !== undefined);

export const MenuNavBar = (): ReactElement => {


    return <NavBar
        brand={generateElementsFor('brand')}
        start={[
            {key: 'graph', item: 'Graph', link: '/graph'},
            {key: 'diagram', item: 'Diagram', link: '/diagram'},
        ]}
    />;
};