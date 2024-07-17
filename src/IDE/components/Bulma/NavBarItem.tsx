import {HTMLAttributeAnchorTarget, ReactElement, ReactNode} from "react";
import {NavLink} from "react-router-dom";

type NavBarItemProps = {
    children: ReactNode,
    link?: string,
    target?:HTMLAttributeAnchorTarget,
}

export const NavBarItem = (props: NavBarItemProps): ReactElement => {
    if (!props.link) {
        return <div className="navbar-item">{props.children}</div>;
    }

    return <NavLink
        to={props.link}
                    className={({isActive}) => isActive ? 'navbar-item is-active' : 'navbar-item'}
        target={props.target}
    >{props.children}</NavLink>;
};