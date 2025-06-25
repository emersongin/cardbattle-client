import { Card } from "./Card";
import { CardState } from "./CardState";
import { EnabledState } from "./EnabledState";

export class DisabledState implements CardState {
    private readonly card: Card;

    constructor(card: Card) {
        this.card = card;
    }

    create() {
        console.log("DisabledState: create called");
    }

    update() {
        console.log("DisabledState: update called");
    }

    enable() {
        if (this.card.disabled === false) return;
        this.card.disabled = false;
        this.card.changeStatus(new EnabledState(this.card));
    }

    disable(): void {
        throw new Error("Cannot disable a card that is already disabled.");
    }
}