import { Card } from "../Card";
import { Move } from "../types/Move";
import { CardState, MovingState, UpdatingState } from "./CardState";
import FlashState from "./FlashState";

export default class StaticState implements CardState {
    constructor(readonly card: Card) {}

    static() {
        throw new Error("cannot call updating() from StaticState.");
    }

    moving(moves: Move[]) {
        this.card.changeState(new MovingState(this.card), moves);
    }

    updating(ap: number, hp: number) {
        this.card.changeState(new UpdatingState(this.card), ap, hp, 1000);
    }

    flash(color: number, delay?: number, duration?: number) {
        this.card.changeState(new FlashState(this.card), color, delay, duration);
    }
}