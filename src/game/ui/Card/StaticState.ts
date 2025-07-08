import { Card } from "./Card";
import { CardState } from "./CardState";

export default class StaticState implements CardState {
    constructor(readonly card: Card) {}

    create() {
        // nothing to do here
    }

    addTweens() {
        // nothing to do here
    }

    preUpdate() {
        //nothing to do here
    }

    static() {
        throw new Error("StaticState is not implemented in StaticState.");
    }

    moving() {
        throw new Error("MovingState is not implemented in StaticState.");
    }

    updating() {
        throw new Error("UpdatingState is not implemented in StaticState.");
    }
}