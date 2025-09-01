import { Card } from "../Card/Card";
import { Cardset } from "./Cardset";
import { CardsetEvents } from "./types/CardsetEvents";
import { ColorsPoints } from "../../types/ColorsPoints";
import { SelectStateConfig } from "./types/SelectStateConfig";
import { CardActionsBuilder } from "../Card/CardActionsBuilder";

export default class SelectMode {
    #index: number;
    #selectNumber: number;
    #events: CardsetEvents;
    #colorsPoints: ColorsPoints | null = null;
    #selectIndexes: number[] = [];
    #disabledIndexes: number[] = [];

    constructor(readonly cardset: Cardset) {}

    create(config: SelectStateConfig): void {
        this.#events = config.events;
        this.#colorsPoints = config.colorPoints || null;
        this.#index = config.startIndex || 0;
        this.#selectNumber = config.selectNumber || 0;
        this.#setDisabledIndexes();
        this.enable();
    }

    #setDisabledIndexes(): void {
        this.cardset.getCards().forEach((card: Card, index: number) => {
            if (card.isDisabled()) this.#disabledIndexes.push(index);
        });
    }

    getSelectIndexes(): number[] {
        return this.#selectIndexes.slice();
    }

    removeLastSeletedIndex(): void {
        if (this.#selectIndexes.length === 0) return;
        const lastIndex = this.#selectIndexes.pop();
        if (lastIndex === undefined) return;
        this.#unmarkCard(this.#getCardByIndex(lastIndex));
        this.#creditPoints(lastIndex);
        this.#removeDisabledIndex(lastIndex);
    }

    enable() {
        this.#addAllKeyboardListeners();
        this.reset();
        this.#updateCardsState();
        this.#updateCursor(this.#getCurrentIndex());
        this.cardset.data.set('selectModeEnabled', true);
    }

    #addAllKeyboardListeners() {
        this.#addOnKeydownRightListener();
        this.#addOnKeydownLeftListener();       
        this.#addOnKeydownEnterListener();
        this.#addOnKeydownEscListener();
    }

    #addOnKeydownRightListener(): void {
        const keyboard = this.#getKeyboard();
        const onKeydownRight = () => {
            const newIndex = this.#index + 1;
            this.#updateCursor(newIndex);
        };
        keyboard.on('keydown-RIGHT', onKeydownRight);
    }

    #addOnKeydownLeftListener(): void {
        const keyboard = this.#getKeyboard();
        const onKeydownLeft = () => {
            const newIndex = this.#index - 1;
            this.#updateCursor(newIndex);
        };
        keyboard.on('keydown-LEFT', onKeydownLeft);
    }

    #addOnKeydownEnterListener(): void {
        const keyboard = this.#getKeyboard();
        const onKeydownEnter = () => {
            const currentIndex = this.#getCurrentIndex();
            if (!this.#isAvaliableCardByIndex(currentIndex)) return;
            if (this.#isIndexSelected(currentIndex)) {
                this.#removeIndex(currentIndex);
                this.#creditPoints(currentIndex);
                this.#unmarkCard(this.#getCardByIndex(currentIndex));
                return;
            }
            this.#selectIndex(currentIndex);
            this.#discountPoints(currentIndex);
            if (this.#selectNumber !== 1) this.#markCard(this.#getCardByIndex(currentIndex));
            if (this.#events.onMarked) this.#events.onMarked(currentIndex);
            if (this.#isSelectLimitReached() || this.#isSelectAll() || this.#isNoHasMoreColorsPoints()) {
                this.#disable();
                if (this.#events.onComplete) this.#events.onComplete(this.getSelectIndexes());
            }
        };
        keyboard.on('keydown-ENTER', onKeydownEnter);
    }

    #addOnKeydownEscListener(): void {
        const keyboard = this.#getKeyboard();
        const onKeydownEsc = () => {
            this.#disable();
            if (this.getSelectIndexes().length > 0) {
                if (this.#events.onComplete) this.#events.onComplete(this.getSelectIndexes());
                return;
            }
            if (this.#events.onLeave) this.#events.onLeave();
        }
        keyboard.on('keydown-ESC', onKeydownEsc);
    }

    reset(): void {
        this.#deselectAll();
        this.#unmarkAll();
        this.#unhighlightAll();
    }

    #updateCardsState(): void {
        this.cardset.getCards().forEach((card: Card, index: number) => {
            if (this.#isCardNoHasMorePoints(card) && !this.#disabledIndexes.includes(index)) {
                this.#disabledIndexes.push(index);
            }
            if (this.#disabledIndexes.includes(index)) {
                this.cardset.disableCardByIndex(index);
            }
            if (this.#selectIndexes.includes(index)) {
                this.#markCard(this.#getCardByIndex(index));
            }
        });
    }

    #getCardByIndex(index: number): Card {
        return this.cardset.getCardByIndex(index)
    }  

    #updateCursor(newIndex: number): void {
        if (!this.cardset.isValidIndex(newIndex)) return;
        const lastIndex = this.#getCurrentIndex();
        this.#sendCardsToBack(lastIndex);
        this.#deselectCard(this.#getCardByIndex(lastIndex));
        this.#updateIndex(newIndex);
        const currentIndex = this.#getCurrentIndex();
        this.#selectCard(this.#getCardByIndex(currentIndex));
        if (this.#events.onChangeIndex) this.#events.onChangeIndex(this.#getCurrentIndex());
    }

    #getCurrentIndex(): number {
        return this.#index;
    }

    #disable() {
        this.#removeAllKeyboardListeners();
        this.reset();
        this.cardset.data.set('selectModeEnabled', false);
    }

    #isAvaliableCardByIndex(index: number): boolean {
        if (!this.cardset.isValidIndex(index)) return false;
        return !this.#disabledIndexes.includes(index) || this.#selectIndexes.includes(index);
    }

    #getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin {
        if (!this.cardset.scene.input.keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        return this.cardset.scene.input.keyboard;
    }

    #sendCardsToBack(index: number): void {
        const cards = this.cardset.getCardsByFromTo(0, index);
        cards.reverse().forEach((card: Card) => {
            this.cardset.sendToBack(card.getUi());
        });
    }

    #deselectCard(card: Card): void {
        this.cardset.deselectCard(card);
        CardActionsBuilder
            .create(card)
            .move({
                xFrom: card.getX(), 
                yFrom: card.getY(), 
                xTo: card.getX(), 
                yTo: 0,
                duration: 10
            })
            .play();
    }

    #updateIndex(index: number): void {
        const totalIndex = this.cardset.getCardsTotal() - 1;
        if (index < 0) {
            this.#index = 0;
        } else if (index >= totalIndex) {
            this.#index = totalIndex;
        } else {
            this.#index = index;
        }
    }

    #selectCard(card: Card): void {
        this.cardset.selectCard(card);
        CardActionsBuilder
            .create(card)
            .move({
                xFrom: card.getX(), 
                yFrom: card.getY(), 
                xTo: card.getX(), 
                yTo: -12,
                duration: 10
            })
            .play();
    }

    #isIndexSelected(index: number): boolean {
        return this.#selectIndexes.includes(index);
    }

    #removeIndex(index: number): void {
        this.#removeSelectIndex(index);
        this.#removeDisabledIndex(index);
    }

    #removeSelectIndex(index: number): void {
        this.#selectIndexes = this.#selectIndexes.filter(i => i !== index);
    }

    #removeDisabledIndex(index: number): void {
        this.#disabledIndexes = this.#disabledIndexes.filter(i => i !== index);
    }

    #creditPoints(index: number): void {
        if (!this.#colorsPoints) return;
        const card = this.#getCardByIndex(index);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] += cardCost;
    }

    #unmarkCard(card: Card): void {
        this.cardset.unmarkCard(card);
    }

    #selectIndex(index: number): void {
        this.#selectIndexes.push(index);
        this.#disabledIndexes.push(index);
    }

    #discountPoints(index: number): void {
        if (!this.#colorsPoints) return;
        const card = this.#getCardByIndex(index);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] -= cardCost;
    }

    #markCard(card: Card): void {
        this.cardset.markCard(card);
        card.disable();
    }

    #isSelectLimitReached(): boolean {
        return (this.#selectNumber > 0) && (this.#selectIndexes.length >= this.#selectNumber);
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

    #unmarkAll(): void {
        this.cardset.getCards().forEach((card: Card) => {
            this.#unmarkCard(card);
        });
    }

    #deselectAll(): void {
        this.cardset.getCards().forEach((card: Card) => {
            this.#deselectCard(card);
        });
    }

    #unhighlightAll(): void {
        this.cardset.getCards().forEach((card: Card) => {
            this.#unhighlightCard(card);
        });
    }

    #unhighlightCard(card: Card): void {
        this.cardset.unhighlightCard(card);
    }
}