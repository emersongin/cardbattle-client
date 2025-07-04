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
        this.updateCursor(this.getIndex());
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
            const currentIndex = this.getIndex();
            if (this.isIndexSelected()) return this.removeIndex(currentIndex);
            this.selectIndex(currentIndex);
            if (this.getSelectNumber() !== 1) {
                this.markCard(currentIndex);
            }
            if (this.isSelectLimitReached() || this.isSelectAll()) this.stopped();
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

    private updateCursor(newIndex: number): void {
        if (!this.cardset.isValidIndex(newIndex)) return;
        const lastIndex = this.getIndex();
        this.sendCardsToBack(lastIndex);
        this.deselectCard(lastIndex);
        this.updateIndex(newIndex);
        this.selectCard(newIndex);
    }

    private getIndex(): number {
        return this.#index;
    }

    private sendCardsToBack(index: number = this.getIndex()): void {
        const cards = this.cardset.getCardListByInterval(0, index);
        cards.reverse().forEach((card: Card) => {
            this.cardset.sendToBack(card);
        });
    }

    private deselectCard(index: number): void {
        const card = this.cardset.getCardByIndex(index);
        card.deselect();
        card.moveFromTo(card.x, card.y, card.x, 0, 10);
    }

    private updateIndex(index: number = this.getIndex()): void {               
        this.setIndex(index);
        if (this.#events.onChangeIndex) this.#events.onChangeIndex(this.getIndex());
    }

    private selectCard(index: number): void {
        const card = this.cardset.getCardByIndex(index);
        this.cardset.bringToTop(card);
        card.moveFromTo(card.x, card.y, card.x, -12, 10);
        card.select();
    }

    private isIndexSelected(index: number = this.getIndex()): boolean {
        return this.getSelectedIndexes().includes(index);
    }

    private getSelectedIndexes(): number[] {
        return this.#selectIndexes;
    }

    private removeIndex(index: number): void {
        this.unmarkCard(index);
        this.#selectIndexes = this.getSelectedIndexes().filter(i => i !== index);
    }

    private unmarkCard(index: number): void {
        const card = this.cardset.getCardByIndex(index);
        card.unmark();
    }

    private selectIndex(index: number): void {
        this.#selectIndexes.push(index);
        if (this.#events.onMarked) this.#events.onMarked(index);
    }

    private markCard(index: number): void {
        const card = this.cardset.getCardByIndex(index);
        card.mark();
    }

    private isSelectLimitReached(): boolean {
        if (this.getSelectNumber() === 0) return false;
        return this.getSelectedIndexes().length >= this.getSelectNumber();
    }

    private isSelectAll(): boolean {
        return this.getSelectedIndexes().length === this.cardset.getCardsTotal();
    }

    private getSelectNumber(): number {
        return this.#selectNumber;
    }

    private stopped(): void {
        const keyboard = this.getKeyboard();
        keyboard.removeAllListeners();
        if (this.getSelectNumber() !== 1) {
            this.sendCardsToBack(this.cardset.getCardsTotal() - 1);
            this.deselectAll();
            this.unmarkAll();
            this.highlightSelectedCards();
        }
        if (this.#events.onCompleted) this.#events.onCompleted(this.getSelectedIndexes());
        this.staticMode();
    }

    unmarkAll(): void {
        this.getSelectedIndexes().forEach((index: number) => {
            this.unmarkCard(index);
        });
    }

    deselectAll(): void {
        this.getSelectedIndexes().forEach((index: number) => {
            this.deselectCard(index);
        });
    }

    highlightSelectedCards(): void {
        this.cardset.getCards().forEach((card: Card, index: number) => {
            if (this.getSelectedIndexes().includes(index)) {
                card.highlight();
            }
        });
    }

    selectMode() {
        throw new Error('SelectState: selectMode should not be called directly.');
    }

    staticMode() {
        this.cardset.changeState(new StaticState(this.cardset));
    }
}