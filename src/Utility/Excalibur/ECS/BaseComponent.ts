import {Actor, Component} from "excalibur";

export abstract class BaseComponent extends Component {
    declare owner?: Actor;

    onAdd?(owner: Actor): void;
    onRemove?(previousOwner: Actor): void;
}