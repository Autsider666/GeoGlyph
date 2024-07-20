import {Actor} from "excalibur";
import {Queue} from "../../Queue.ts";
import {Action} from "./Action.ts";

export type Goal = Queue<Action>;

export type AgentObject = Actor;