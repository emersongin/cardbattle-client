import { Card } from "./Card";
import { CardState } from "./CardState";
import { DisabledState } from "./DisabledState";

export class EnabledState implements CardState {
    private readonly card: Card;

    constructor(card: Card) {
        this.card = card;
    }

    create() {
        console.log("EnabledState: create called");
    }

    update() {
        console.log("EnabledState: update called");
    }

    enable() {
        throw new Error("Card is already enabled.");
    }

    disable(): void {
        if (this.card.disabled) return;
        this.card.disabled = true;
        this.card.changeStatus(new DisabledState(this.card));
    }
}