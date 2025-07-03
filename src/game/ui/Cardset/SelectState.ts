import { Cardset } from "./Cardset";
import { CardsetEvents } from "./CardsetEvents";
import { CardsetState } from "./CardsetState";

export default class SelectState implements CardsetState {
    #index: number = 0;
    #events: CardsetEvents;

    constructor(readonly cardset: Cardset) {}

    create(events: CardsetEvents) {
        this.#events = events;
        this.setKeyboard();
        this.updateCursor(this.#index);
    }

    private setKeyboard() {
        const keyboard = this.cardset.scene.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        keyboard.on('keydown-LEFT', () => {
            this.updateCursor(this.#index - 1);
        });
        keyboard.on('keydown-RIGHT', () => {
            this.updateCursor(this.#index + 1);
        });

        // todo: add support for ESC key to leave the cardset
        // todo: add support for ENTER key to select the card
        if (this.#events.onLeave) {
            keyboard.once('keydown-ESC', this.#events.onLeave);
        }
        if (this.#events.onChoice) {
            keyboard.on('keydown-ENTER', this.#events.onChoice);
        }
    }

    update() {
        //nothing to do here
    }

    updateCursor(index: number) {
        if (!this.cardset.isIndexWithinLimit(index)) return;
        this.cardset.sendCardToBack(this.#index);
        this.updateIndex(index);
        this.cardset.selectCard(this.#index);
    }

    updateIndex(index: number) {               
        this.#index = index;
        if (this.#events.onChangeIndex) {
            this.#events.onChangeIndex(this.cardset.getCardByIndex(this.#index));
        }
    }
    
    stopped() {
        throw new Error('SelectState: stopped called, this should not happen');
    }
}