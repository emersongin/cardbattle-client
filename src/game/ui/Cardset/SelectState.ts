import { Cardset } from "./Cardset";
import { CardsetState } from "./CardsetState";

export default class SelectState implements CardsetState {
    constructor(readonly cardset: Cardset) {}

    create() {
        // This method is called when the state is created.
    }

    update() {
        //nothing to do here
    }

    stopped() {
        throw new Error('SelectState: stopped called, this should not happen');
    }
}