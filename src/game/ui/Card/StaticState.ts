import { Card } from "./Card";
import { CardState } from "./CardState";

export default class StaticState implements CardState {
    constructor(
        readonly card: Card
    ) {}

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