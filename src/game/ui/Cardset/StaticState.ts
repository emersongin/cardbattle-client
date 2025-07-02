import { Cardset } from "./Cardset";
import { CardsetState } from "./CardsetState";

export default class StaticState implements CardsetState {
    constructor(readonly cardset: Cardset) {}

    create() {
        // This method is called when the state is created.
    }

    update() {
        //nothing to do here
        // console.log("StaticState update");
    }

    stopped() {
        throw new Error('StaticState: stopped called, this should not happen');
    }
}