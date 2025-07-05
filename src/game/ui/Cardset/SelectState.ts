import { Card } from "../Card/Card";
import { Cardset } from "./Cardset";
import { CardsetEvents } from "./CardsetEvents";
import { CardsetState } from "./CardsetState";
import { ColorsPoints } from "../ColorsPoints";
import StaticState from "./StaticState";

export default class SelectState implements CardsetState {
    #index: number;
    #selectNumber: number;
    #events: CardsetEvents;
    #colorsPoints: ColorsPoints | null = null;
    #selectIndexes: number[] = [];
    #disabledIndexes: number[] = [];

    constructor(readonly cardset: Cardset) {}

    create(events: CardsetEvents, colorPoints: ColorsPoints, selectNumber: number = 0, startIndex: number = 0) {
        this.#events = events;
        this.#colorsPoints = colorPoints;
        this.#index = startIndex;
        this.#selectNumber = selectNumber;
        this.#setKeyboard();
        this.#updateCursor(this.#index);
        this.#updateCardsState();
    }

    #setKeyboard() {
        const keyboard = this.#getKeyboard();
        const onKeydownLeft = () => {
            const newIndex = this.#index - 1;
            if (this.#events.onChangeIndex) this.#events.onChangeIndex(newIndex);
            this.#updateCursor(newIndex);
        };
        const onKeydownRight = () => {
            const newIndex = this.#index + 1;
            if (this.#events.onChangeIndex) this.#events.onChangeIndex(newIndex);
            this.#updateCursor(newIndex);
        };
        const onKeydownEnter = () => {
            const currentIndex = this.#index;
            if (!this.#isAvaliableCardByIndex(currentIndex)) return;
            if (this.#isIndexSelected()) {
                this.#removeIndex(currentIndex);
                this.#creditPoints(currentIndex);
            }
            if (this.#events.onMarked) this.#events.onMarked(currentIndex);
            this.#selectIndex(currentIndex);
            this.#discountPoints(currentIndex);
            if (this.#selectNumber !== 1) {
                this.#markCardByIndex(currentIndex);
            }
            // console.log(this.#isSelectLimitReached());
            // console.log(this.#isSelectAll());
            // console.log(this.#isNoHasMoreColorsPoints());
            if (this.#isSelectLimitReached() || this.#isSelectAll() || this.#isNoHasMoreColorsPoints()) {
                if (this.#events.onCompleted) this.#events.onCompleted(this.#selectIndexes);
                this.#resetCardsState();
                this.#removeAllKeyboardListeners();
                this.#highlightSelectedCards();
                this.staticMode();
            }
        };
        const onKeydownEsc = () => {
            if (this.#events.onLeave) this.#events.onLeave();
            this.#resetCardsState();
            this.#removeAllKeyboardListeners();
            this.staticMode();
        }
        keyboard.on('keydown-LEFT', onKeydownLeft);
        keyboard.on('keydown-RIGHT', onKeydownRight);
        keyboard.on('keydown-ENTER', onKeydownEnter);
        keyboard.on('keydown-ESC', onKeydownEsc);
    }

    #isAvaliableCardByIndex(index: number): boolean {
        if (!this.cardset.isValidIndex(index)) return false;
        return !this.#disabledIndexes.includes(index);
    }

    #getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin {
        if (!this.cardset.scene.input.keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        return this.cardset.scene.input.keyboard;
    }

    #updateCursor(newIndex: number): void {
        if (!this.cardset.isValidIndex(newIndex)) return;
        const lastIndex = this.#index;
        this.#sendCardsToBack(lastIndex);
        const lastCard = this.cardset.getCardByIndex(lastIndex);
        this.#deselectCard(lastCard);
        this.#updateIndex(newIndex);
        const newCard = this.cardset.getCardByIndex(newIndex);
        this.#selectCard(newCard);
    }

    #sendCardsToBack(index: number = this.#index): void {
        const cards = this.cardset.getCardListByInterval(0, index);
        cards.reverse().forEach((card: Card) => {
            this.cardset.sendToBack(card);
        });
    }

    #deselectCard(card: Card): void {
        card.deselect();
        card.moveFromTo(card.x, card.y, card.x, 0, 10);
    }

    #updateIndex(index: number = this.#index): void {               
        this.#index = index;
    }

    #selectCard(card: Card): void {
        this.cardset.bringToTop(card);
        card.moveFromTo(card.x, card.y, card.x, -12, 10);
        card.select();
    }

    #updateCardsState(): void {
        this.cardset.getCards().forEach((card: Card, index: number) => {
            if (this.#isCardNoHasMorePoints(card)) {
                this.#disabledIndexes.push(index);
            }
            if (this.#disabledIndexes.includes(index)) {
                this.#disableCardByIndex(index);
            }
            if (this.#selectIndexes.includes(index)) {
                this.#markCardByIndex(index);
            }
        });
    }

    #isIndexSelected(index: number = this.#index): boolean {
        return this.#selectIndexes.includes(index);
    }

    #removeIndex(index: number): void {
        this.#unmarkCardByIndex(index);
        this.#selectIndexes = this.#selectIndexes.filter(i => i !== index);
    }

    #creditPoints(index: number): void {
        if (!this.#colorsPoints) return;
        const card = this.cardset.getCardByIndex(index);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] += cardCost;
    }

    #unmarkCardByIndex(index: number): void {
        const card = this.cardset.getCardByIndex(index);
        card.unmark();
    }

    #selectIndex(index: number): void {
        this.#selectIndexes.push(index);
    }

    #discountPoints(index: number): void {
        if (!this.#colorsPoints) return;
        const card = this.cardset.getCardByIndex(index);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] -= cardCost;
    }

    #markCardByIndex(index: number): void {
        const card = this.cardset.getCardByIndex(index);
        card.mark();
    }

    #isSelectLimitReached(): boolean {
        if (this.#selectNumber === 0) return false;
        return this.#selectIndexes.length >= this.#selectNumber;
    }

    #isSelectAll(): boolean {
        return this.#selectIndexes.length === (this.cardset.getCardsTotal() - this.#disabledIndexes.length);
    }

    #isNoHasMoreColorsPoints(): boolean {
        if (!this.#colorsPoints) return false;
        const allIndexes = this.cardset.getIndexesToArray();
        const avaliableIndexes = allIndexes.filter((index: number) => !this.#selectIndexes.includes(index));
        const avaliableCards = this.cardset.getCardsByIndexes(avaliableIndexes);
        return avaliableCards.some((card: Card) => {
            return this.#isCardNoHasMorePoints(card);
        });
    }

    #isCardNoHasMorePoints(card: Card): boolean {
        if (!this.#colorsPoints) return false;
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        return this.#colorsPoints[cardColor] < cardCost;
    }

    #removeAllKeyboardListeners() {
        const keyboard = this.#getKeyboard();
        keyboard.removeAllListeners();
    }

    #resetCardsState(): void {
        if (this.#selectNumber !== 1) {
            this.#sendCardsToBack(this.cardset.getCardsTotal() - 1);
            this.#deselectAll();
            this.#unmarkAll();
        }
    }

    #unmarkAll(): void {
        this.#selectIndexes.forEach((index: number) => {
            this.#unmarkCardByIndex(index);
        });
    }

    #deselectAll(): void {
        this.cardset.getCards().forEach((card: Card) => {
            card.deselect();
            card.moveFromTo(card.x, card.y, card.x, 0, 10);
        });
    }

    #highlightSelectedCards(): void {
        this.cardset.getCards().forEach((card: Card, index: number) => {
            if (this.#selectIndexes.includes(index)) {
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

    disableBattleCards(): void {
        const cards = this.cardset.getCards();
        cards.forEach((card: Card, index: number) => {
            if (card.isBattleCard()) {
                this.#disableCardByIndex(index);
                this.#disabledIndexes.push(index);
            }
        });
    }

    #disableCardByIndex(index: number): void {
        const card = this.cardset.getCardByIndex(index);
        card.disable();
    }

    disablePowerCards(): void {
        const cards = this.cardset.getCards();
        cards.forEach((card: Card, index: number) => {
            if (card.isPowerCard()) {
                this.#disableCardByIndex(index);
                this.#disabledIndexes.push(index);
            }
        });
    }
}