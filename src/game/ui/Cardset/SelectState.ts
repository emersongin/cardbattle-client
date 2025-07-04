import { Card } from "../Card/Card";
import { Cardset } from "./Cardset";
import { CardsetEvents } from "./CardsetEvents";
import { CardsetState } from "./CardsetState";
// import { ColorPoints } from "./ColorPoints";
import StaticState from "./StaticState";

export default class SelectState implements CardsetState {
    #index: number;
    #selectNumber: number;
    #events: CardsetEvents;
    // #colorPoints: ColorPoints;
    #selectIndexes: number[] = [];

    constructor(readonly cardset: Cardset) {}

    create(events: CardsetEvents, selectNumber: number = 0, startIndex: number = 0) {
        this.setEvents(events);
        this.setIndex(startIndex);
        this.setSelectNumber(selectNumber);
        this.setKeyboard();
        this.updateCursor();
    }

    private setEvents(events: CardsetEvents) {
        this.#events = events;
    }

    private setIndex(index: number) {
        this.#index = index;
    }

    private setSelectNumber(selectNumber: number) {
        this.#selectNumber = selectNumber;
    }

    private setKeyboard() {
        const keyboard = this.getKeyboard();
        const onKeydownLeft = () => {
            this.updateCursor(this.getIndex() - 1);
        };
        const onKeydownRight = () => {
            this.updateCursor(this.getIndex() + 1);
        };
        const onKeydownEnter = () => {
            if (this.isIndexSelected()) return this.removeIndex();
            this.selectIndex();
            if (this.isSelectLimitReached()) this.stopped();
        };
        keyboard.on('keydown-LEFT', onKeydownLeft);
        keyboard.on('keydown-RIGHT', onKeydownRight);
        keyboard.on('keydown-ENTER', onKeydownEnter);

        // todo: add support for ESC key to leave the cardset
        // todo: add support for ENTER key to select the card
        if (this.#events.onLeave) {
            keyboard.once('keydown-ESC', this.#events.onLeave);
        }
    }

    private getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin {
        if (!this.cardset.scene.input.keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        return this.cardset.scene.input.keyboard;
    }

    updateCursor(index: number = this.getIndex()): void {
        if (!this.cardset.isValidIndex(index)) return;
        this.sendCardsToBack();
        this.updateIndex(index);
        this.selectCard();
    }

    private getIndex(): number {
        return this.#index;
    }

    sendCardsToBack(index: number = this.getIndex()): void {
        const cards = this.cardset.getCardListByInterval(0, index);
        cards.reverse().forEach((card: Card) => {
            this.cardset.sendToBack(card);
            card.moveFromTo(card.x, card.y, card.x, 0, 10);
            card.deselect();
        });
    }

    updateIndex(index: number) {               
        this.setIndex(index);
        if (this.#events.onChangeIndex) this.#events.onChangeIndex(this.getIndex());
    }

    selectCard(index: number = this.getIndex()): void {
        const card = this.cardset.getCardByIndex(index);
        this.cardset.bringToTop(card);
        card.moveFromTo(card.x, card.y, card.x, -12, 10);
        card.select();
    }

    private isIndexSelected(index: number = this.getIndex()): boolean {
        return this.#selectIndexes.includes(index);
    }

    removeIndex(index: number = this.getIndex()): void {
        this.#selectIndexes = this.#selectIndexes.filter(i => i !== index);
    }

    selectIndex(index: number = this.getIndex()): void {
        this.#selectIndexes.push(index);
        if (this.#events.onMarked) this.#events.onMarked(this.getIndex());
    }

    isSelectLimitReached(): boolean {
        if (this.#selectNumber === 0) return false;
        return this.#selectIndexes.length >= this.#selectNumber;
    }

    stopped() {
        if (this.#events.onCompleted) this.#events.onCompleted(this.#selectIndexes);
        const keyboard = this.getKeyboard();
        keyboard.removeAllListeners();
        this.cardset.changeState(new StaticState(this.cardset));
    }

    update() {
        //nothing to do here
    }
}