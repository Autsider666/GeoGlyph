import {ReactElement} from "react";
import {Link} from "react-router-dom";
import {FasIcon} from "../Bulma/FasIcon.tsx";

export const MenuBrand = (): ReactElement =>
    <Link to={'/'} className="navbar-item">
        <FasIcon icon="fa-globe">GeoGlyph</FasIcon>
    </Link>;