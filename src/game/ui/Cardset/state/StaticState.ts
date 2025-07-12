import { Cardset } from "./Cardset";
import { CardsetState } from "./state/CardsetState";

export default class StaticState implements CardsetState {
    constructor(readonly cardset: Cardset) {}

    selectMode() {
        throw new Error('StaticState: selectMode called, this should not happen');
    }

    staticMode() {
        throw new Error('StaticState: staticMode called, this should not happen');
    }
}