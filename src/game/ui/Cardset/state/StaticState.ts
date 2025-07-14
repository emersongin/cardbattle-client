import { Cardset } from "../Cardset";
import { CardsetState, SelectState } from "./CardsetState";

export default class StaticState implements CardsetState {
    constructor(readonly cardset: Cardset) {}

    create(): void {
        throw new Error("StaticState: create method should not be called.");
    }

    selectMode() {
        this.cardset.changeState(new SelectState(this.cardset));
    }

    staticMode() {
        throw new Error('StaticState: staticMode called, this should not happen');
    }
}