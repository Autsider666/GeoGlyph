import classNames from "classnames";
import {ReactElement, ReactNode, useState} from "react";
import {NavBarItem} from "./NavBarItem.tsx";

type NavBarItem = {
    key: string,
    item: ReactNode,
    link?: string,
}

type NavBarProps = {
    brand?: ReactElement[],
    start?: NavBarItem[],
    end?: NavBarItem[],
};

export const NavBar = (props: NavBarProps): ReactElement => {
    const [expanded, setExpanded] = useState(false);

    return <header className="navbar" style={{right: 0}}>
        {props.brand ? (
            <div className="navbar-brand">
                {props.brand}

                {props.start?.length || props.end?.length ? (
                    <a role="button"
                       className="navbar-burger"
                       aria-label="menu"
                       aria-expanded={expanded}
                       onClick={() => setExpanded(!expanded)}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                ) : undefined}
            </div>
        ) : undefined}
        {props.start || props.end ? (
            <div className={classNames({
                'navbar-menu': true,
                'is-active': expanded,
            })}>
                {props.start?.length ? (
                    <div className="navbar-start">
                        {props.start.map(
                            ({key, item, link}) => <NavBarItem key={key} link={link}>{item}</NavBarItem>
                        )}
                    </div>
                ) : undefined}
                {props.end?.length ? (
                    <div className="navbar-end">
                        {props.end.map(
                            ({key, item, link}) => <NavBarItem key={key} link={link}>{item}</NavBarItem>
                        )}
                    </div>
                ) : undefined}
            </div>
        ) : undefined}
    </header>;
};