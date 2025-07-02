import { Cardset } from "./Cardset";
import { CardsetEvents } from "./CardsetEvents";
import { CardsetState } from "./CardsetState";

export default class SelectState implements CardsetState {
    #index: number = 0;
    #events: CardsetEvents;

    constructor(readonly cardset: Cardset) {}

    create(events: CardsetEvents) {
        // This method is called when the state is created.
        this.#events = events;
        this.setKeyboard();
    }

    private setKeyboard() {
        const keyboard = this.cardset.scene.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        if (this.#events.onLeave) {
            keyboard.once('keydown-ESC', this.#events.onLeave);
        }
        if (this.#events.onLeftArrow) {
            keyboard.on('keydown-LEFT', () => {
                this.updateCursor(this.#index - 1);
                if (!this.#events.onLeftArrow) return;
                this.#events.onLeftArrow();
            });
        }
        if (this.#events.onRightArrow) {
            keyboard.on('keydown-RIGHT', () => {
                this.updateCursor(this.#index + 1);
                if (!this.#events.onRightArrow) return;
                this.#events.onRightArrow();
            });
        }
        if (this.#events.onChoice) {
            keyboard.on('keydown-ENTER', this.#events.onChoice);
        }
    }

    update() {
        //nothing to do here
    }

    updateCursor(index: number) {
        if (index < 0 || index > this.cardset.getCardsTotal()) return;
        this.#index = index;
        console.log(this.#index);
    }

    stopped() {
        throw new Error('SelectState: stopped called, this should not happen');
    }
}