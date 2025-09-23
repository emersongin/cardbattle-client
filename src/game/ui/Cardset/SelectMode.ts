import { ORANGE } from "@/game/constants/colors";
import { CardColorsType } from "@/game/types/CardColorsType";
import { Card } from "@ui/Card/Card";
import { Cardset } from "@ui/Cardset/Cardset";
import { CardsetEvents } from "@ui/Cardset/CardsetEvents";
import { BoardWindow } from "../BoardWindow/BoardWindow";

export class SelectMode {
    #events: CardsetEvents;
    #index: number;
    #selectionsNumber: number;
    #selectIds: string[] = [];
    #disabledIds: string[] = [];
    #board: BoardWindow | null;

    constructor(readonly cardset: Cardset) {}

    create(events: CardsetEvents, selectionsNumber: number = 0, board?: BoardWindow): void {
        this.#events = events;
        this.#board = board ?? null;
        this.#index = 0;
        this.#selectionsNumber = selectionsNumber;
        this.#addDisabledCards();
        this.enable();
    }

    #addDisabledCards(): void {
        this.cardset.getCards().forEach((card: Card) => {
            if (card.isDisabled()) this.#disabledIds.push(card.getId());
        });
    }

    enable() {
        this.cardset.data.set('selectModeEnabled', true);
        this.#updateCursor();
        this.#addAllKeyboardListeners();
    }

    #updateCursor(newIndex: number = this.#getCurrentIndex()): void {
        if (!this.cardset.isValidIndex(newIndex)) return;
        this.#deselectCardByIndex(this.#getCurrentIndex());
        this.#changeIndex(newIndex);
        if (this.#events.onChangeIndex) this.#events.onChangeIndex(this.#getCurrentId());
        const card = this.#getCardByIndex(newIndex);
        const isMarkedState = card.isMarked();
        this.#selectCardByIndex(newIndex);
        if (isMarkedState) this.cardset.markCardById(card.getId());
    }

    #getCurrentIndex(): number {
        return this.#index;
    }

    #deselectCardByIndex(index: number): void {
        this.#sendCardsToBackEqualOrLessByIndex(index);
        const cardId = this.#getIdByIndex(index);
        const card = this.#getCardById(cardId);
        const isMarkedState = card.isMarked();
        this.cardset.removeAllSelectCardById(cardId);
        if (isMarkedState) this.cardset.markCardById(cardId);
        this.cardset.moveCardById(cardId, { yTo: 0, duration: 10 });
    }

    #sendCardsToBackEqualOrLessByIndex(index: number): void {
        const cards = this.cardset.getCardsByFromTo(0, index);
        cards.reverse().forEach((card: Card) => {
            this.cardset.sendToBack(card.getUi());
        });
    }

    #getCurrentId(): string {
        return this.#getIdByIndex(this.#getCurrentIndex());
    }

    #getIdByIndex(index: number): string {
        return this.#getCardByIndex(index).getId();
    }

    #getCardByIndex(index: number): Card {
        return this.cardset.getCardByIndex(index ?? this.#getCurrentIndex());
    }

    #changeIndex(index: number): void {
        const totalIndex = this.#getIndexesTotal();
        if (index < 0) {
            this.#index = 0;
        } else if (index >= totalIndex) {
            this.#index = totalIndex;
        } else {
            this.#index = index;
        }
    }

    #getIndexesTotal(): number {
        return this.cardset.getCardsTotal() - 1;
    }

    #selectCardByIndex(index: number): void {
        const card = this.#getCardByIndex(index);
        this.cardset.bringToTop(card.getUi());
        const cardId = card.getId();
        this.cardset.selectCardById(cardId);
        this.cardset.moveCardById(cardId, { yTo: -12, duration: 10 });
    }

    #getCardById(cardId: string): Card {
        return this.cardset.getCardById(cardId);
    }

    #addAllKeyboardListeners() {
        this.#addOnKeydownRightListener();
        this.#addOnKeydownLeftListener();       
        this.#addOnKeydownEscListener();
        this.#addOnKeydownEnterListener();
    }

    #addOnKeydownRightListener(): void {
        this.#getKeyboard().on('keydown-RIGHT', () => this.#updateCursor(this.#index + 1));
    }

    #getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin {
        if (!this.cardset.scene.input.keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        return this.cardset.scene.input.keyboard;
    }

    #addOnKeydownLeftListener(): void {
        this.#getKeyboard().on('keydown-LEFT', () => this.#updateCursor(this.#index - 1));
    }

    #addOnKeydownEscListener(): void {
        if (!this.#events.onLeave) return;
        const onKeydownEsc = () => {
            this.#disable();
            if (this.#events.onLeave) this.#events.onLeave();
        }
        this.#getKeyboard().on('keydown-ESC', onKeydownEsc);
    }

    #disable() {
        this.cardset.data.set('selectModeEnabled', false);
        this.#deselectCardByIndex(this.#getCurrentIndex());
        this.#removeAllKeyboardListeners();
    }

    #removeAllKeyboardListeners() {
        this.#getKeyboard().removeAllListeners();
    }

    #addOnKeydownEnterListener(): void {
        const onKeydownEnter = () => {
            const currentId = this.#getCurrentId();
            if (this.#isCardDisabledById(currentId)) return;
            if (this.#isOneSelectMode()) {
                this.#selectId(currentId);
                this.#disable();
                if (this.#events.onComplete) this.#events.onComplete(this.getIdsSelected());
                return;
            }
            // select mode many
            if (!this.#isIdSelected(currentId) && this.#notHaveEnoughPoints(currentId)) return;
            if (this.#isIdSelected(currentId)) {
                this.#removeId(currentId);
                this.#creditPointsById(currentId);
                this.cardset.enableCardById(currentId);
                this.#unmarkCardById(currentId);
                this.#disableCardsWithoutEnoughPoints();
                return;
            }
            this.#selectId(currentId);
            this.#debitPointsById(currentId);
            this.cardset.disableCardById(currentId);
            this.#markCardById(currentId);
            if (this.#events.onMarked) this.#events.onMarked(currentId);
            this.#disableCardsWithoutEnoughPoints();
            if (this.#noCardsAvaliable()) {
                this.#disable();
                if (this.#events.onComplete) this.#events.onComplete(this.getIdsSelected());
            }
        };
        this.#getKeyboard().on('keydown-ENTER', onKeydownEnter);
    }

    #isOneSelectMode(): boolean {
        return this.#selectionsNumber === 1;
    }

    #isCardDisabledById(cardId: string): boolean {
        return this.#disabledIds.includes(cardId) && !this.#selectIds.includes(cardId);
    }

    #isIdSelected(cardId: string): boolean {
        return this.#selectIds.includes(cardId);
    }

    #selectId(cardId: string): void {
        const selectIds = this.#selectIds;
        const disabledIds = this.#disabledIds;
        this.#selectIds = [...new Set([...selectIds, cardId])];
        this.#disabledIds = [...new Set([...disabledIds, cardId])];
    }

    #debitPointsById(cardId: string): void {
        const card = this.#getCardById(cardId);
        const cardColor = card.getColor() as CardColorsType;
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        if (this.#board && this.#board.hasEnoughColorPointsByColor(cardColor, cardCost)) {
            this.#board.removeColorPoints(cardColor, cardCost);
        }
        if (this.#events.onDebitPoint) this.#events.onDebitPoint(cardId);
    }

    #removeId(cardId: string): void {
        this.#selectIds = this.#selectIds.filter(i => i !== cardId);
        this.#removeDisabledById(cardId);
    }

    #removeDisabledById(cardId: string): void {
        this.#disabledIds = this.#disabledIds.filter(i => i !== cardId);
    }

    #creditPointsById(cardId: string): void {
        const card = this.#getCardById(cardId);
        const cardColor = card.getColor() as CardColorsType;
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        if (this.#board && cardCost > 0) this.#board.addColorPoints(cardColor, cardCost);
        if (this.#events.onCreditPoint) this.#events.onCreditPoint(cardId);
    }

    #disableCardsWithoutEnoughPoints(): void {
        this.cardset.getCards().forEach((card: Card) => {
            const cardId = card.getId();
            if (this.#isIdSelected(cardId) || this.#isIdDisabled(cardId)) return;
            if (this.#notHaveEnoughPoints(cardId)) {
                this.cardset.disableCardById(cardId);
                return;
            }
            this.cardset.enableCardById(cardId);
        });
    }

    #isIdDisabled(cardId: string): boolean {
        return this.#disabledIds.includes(cardId);
    }

    #notHaveEnoughPoints(cardId: string): boolean {
        const card = this.#getCardById(cardId);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        if (this.#board) {
            return this.#board.hasEnoughColorPointsByColor(cardColor, cardCost) === false;
        }
        return false;
    }

    #markCardById(cardId: string): void {
        this.cardset.markCardById(cardId);
        this.cardset.disableCardById(cardId);
    }

    #unmarkCardById(cardId: string): void {
        this.cardset.selectCardById(cardId);
        this.cardset.enableCardById(cardId);
    }

    #noCardsAvaliable(): boolean {
        return this.cardset.getCards().every((card: Card) => card.isDisabled());
    }

    getIdsSelected(): string[] {
        return this.#selectIds.slice();
    }

    restoreSelectMode(): void {
        const lastId = this.#getLastIdSelected();
        this.#removeId(lastId);
        this.#creditPointsById(lastId);
        this.cardset.enableCardById(lastId);
        if (this.#isManySelectMode()) this.#unmarkCardById(lastId);
        this.#disableCardsWithoutEnoughPoints();
        const cardsSelected = this.getIdsSelected();
        cardsSelected.forEach(cardId => {
            this.cardset.markCardById(cardId);
            this.cardset.disableCardById(cardId);
        });
        this.enable();
    }

    #isManySelectMode(): boolean {
        return this.#selectionsNumber !== 1;
    }

    #getLastIdSelected(): string {
        return this.#selectIds[this.#selectIds.length - 1];
    }

}