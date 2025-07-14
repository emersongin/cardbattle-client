import { Card } from "../Card";
import { Move } from "../types/Move";
import { CardState, MovingState, UpdatingState } from "./CardState";

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

    moving(moves: Move[]) {
        this.card.changeState(new MovingState(this.card), moves);
    }

    updating(ap: number, hp: number) {
        this.card.changeState(new UpdatingState(this.card), ap, hp, 1000);
    }
}