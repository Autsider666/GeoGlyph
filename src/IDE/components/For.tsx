import {ReactElement} from "react";

type ForProps<Item> = {
    each: Item[] | undefined,
    children: (item: Item, index: number) => ReactElement,
}

export const For = <Item, >(props: ForProps<Item>): ReactElement | undefined => {
    if (props.each === undefined) {
        return undefined;
    }

    return <>
        {props.each.map((item, index) => props.children(item, index))}
    </>;
};