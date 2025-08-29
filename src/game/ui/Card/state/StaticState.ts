import { Card } from "../Card";
import { FlashCardConfig } from "../animations/types/FlashCardConfig";
import { Move } from "../types/Move";
import { CardState, FlashState, MovingState, UpdatingState } from "./CardState";

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

    flash(config: FlashCardConfig) {
        this.card.changeState(new FlashState(this.card), config);
    }
}