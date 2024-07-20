import {AgentObject} from "../GOAP/types.ts";
import {FiniteStateMachine} from "./FiniteStateMachine.ts";

export type State = (param: FiniteStateMachine, actor: AgentObject) => void;