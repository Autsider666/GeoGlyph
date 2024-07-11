import {ReactElement} from "react";
import {Link} from "react-router-dom";
import {FasIcon, FasIconType} from "../Bulma/FasIcon.tsx";

type MenuItemProps = {
    name: string,
    to: string,
    icon?: FasIconType,
}

export const MenuItem = (props: MenuItemProps): ReactElement =>
    <Link to={props.to} className="navbar-item">
        {props.icon ? <FasIcon icon={props.icon}>{props.name}</FasIcon> : props.name}
    </Link>;