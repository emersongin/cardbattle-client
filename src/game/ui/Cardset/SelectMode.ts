import { ColorsPointsData } from "@objects/CardsFolderData";
import { Card } from "@ui/Card/Card";
import { Cardset } from "@ui/Cardset/Cardset";
import { CardsetEvents } from "@ui/Cardset/CardsetEvents";

export class SelectMode {
    #events: CardsetEvents;
    #index: number;
    #selectionsNumber: number;
    #colorsPoints: ColorsPointsData | null = null;
    #selectIds: string[] = [];
    #disabledIds: string[] = [];

    constructor(readonly cardset: Cardset) {}

    create(events: CardsetEvents, selectionsNumber?: number, colorPoints?: ColorsPointsData): void {
        this.#events = events;
        this.#colorsPoints = colorPoints || null;
        this.#index = 0;
        this.#selectionsNumber = selectionsNumber || 0;
        this.#addDisabledCards();
        this.enable();
    }

    #addDisabledCards(): void {
        this.cardset.getCards().forEach((card: Card) => {
            if (card.isDisabled()) this.#disabledIds.push(card.getId());
        });
    }

    enable() {
        this.#addAllKeyboardListeners();
        this.reset();
        this.#updateCardsState();
        this.#updateCursor();
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
        const onKeydownRight = () => this.#updateCursor(this.#index + 1);
        keyboard.on('keydown-RIGHT', onKeydownRight);
    }

    #getKeyboard(): Phaser.Input.Keyboard.KeyboardPlugin {
        if (!this.cardset.scene.input.keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        return this.cardset.scene.input.keyboard;
    }

    #updateCursor(newIndex: number = this.#getCurrentIndex()): void {
        if (!this.cardset.isValidIndex(newIndex)) return;
        this.#deselectLastIndex();
        this.#updateNewIndex(newIndex);
    }

    #deselectLastIndex(): void {
        this.#sendCardsToBack(this.#getCurrentIndex());
        this.#deselectCardById(this.#getCurrentId());
    }

    #sendCardsToBack(index: number): void {
        const cards = this.cardset.getCardsByFromTo(0, index);
        cards.reverse().forEach((card: Card) => {
            this.cardset.sendToBack(card.getUi());
        });
    }

    #getCurrentIndex(): number {
        return this.#index;
    }

    #deselectCardById(cardId: string): void {
        this.cardset.deselectCardById(cardId);
        this.cardset.moveCardById(cardId, { yTo: 0, duration: 10 });
    }

    #updateNewIndex(newIndex: number): void {
        this.#updateIndex(newIndex);
        this.#selectCardById(this.#getCurrentId());
        if (this.#events.onChangeIndex) this.#events.onChangeIndex(this.#getCurrentId());
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

    #selectCardById(cardId: string): void {
        this.cardset.selectCardById(cardId);
        this.cardset.moveCardById(cardId, { yTo: -12, duration: 10 });
    }

    #getCurrentId(): string {
        return this.cardset.getCardByIndex(this.#getCurrentIndex()).getId();
    }

    #updateCardsState(): void {
        this.cardset.getCards().forEach((card: Card) => {
            const cardId = card.getId();
            if (this.#isCardNoHasMorePoints(card) && !this.#disabledIds.includes(cardId)) {
                this.#disabledIds.push(cardId);
            }
            if (this.#disabledIds.includes(cardId)) {
                this.cardset.disableCardById(cardId);
            }
            if (this.#selectIds.includes(cardId)) {
                this.#markCardById(cardId);
            }
        });
    }

    #isCardNoHasMorePoints(card: Card): boolean {
        if (!this.#colorsPoints) return false;
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        return this.#colorsPoints[cardColor] < cardCost;
    }

    #markCardById(cardId: string): void {
        this.cardset.markCardById(cardId);
        this.cardset.disableCardById(cardId);
    }

    #addOnKeydownLeftListener(): void {
        const keyboard = this.#getKeyboard();
        const onKeydownLeft = () => this.#updateCursor(this.#index - 1);
        keyboard.on('keydown-LEFT', onKeydownLeft);
    }

    #addOnKeydownEnterListener(): void {
        const keyboard = this.#getKeyboard();
        const onKeydownEnter = () => {
            const currentId = this.#getCurrentId();
            if (!this.#isCardAvaliableById(currentId)) return;
            if (this.#isIdSelected(currentId)) {
                this.#removeId(currentId);
                this.#creditPointsById(currentId);
                this.#unmarkCardById(currentId);
                return;
            }
            this.#selectId(currentId);
            this.#discountPointsById(currentId);
            if (this.#selectionsNumber !== 1) this.#markCardById(currentId);
            if (this.#events.onMarked) this.#events.onMarked(currentId);
            if (this.#isSelectLimitReached() || this.#isAllIdsSelected() || this.#noHasMoreColorPoints()) {
                this.#disable();
                if (this.#events.onComplete) this.#events.onComplete(this.getIdsSelected());
            }
        };
        keyboard.on('keydown-ENTER', onKeydownEnter);
    }

    #isCardAvaliableById(cardId: string): boolean {
        return !this.#disabledIds.includes(cardId) || this.#selectIds.includes(cardId);
    }

    #isIdSelected(cardId: string): boolean {
        return this.#selectIds.includes(cardId);
    }

    #removeId(cardId: string): void {
        this.#removeSelectedById(cardId);
        this.#removeDisabledById(cardId);
    }

    #removeSelectedById(cardId: string): void {
        this.#selectIds = this.#selectIds.filter(i => i !== cardId);
    }

    #removeDisabledById(cardId: string): void {
        this.#disabledIds = this.#disabledIds.filter(i => i !== cardId);
    }

    #creditPointsById(cardId: string): void {
        if (!this.#colorsPoints) return;
        const card = this.cardset.getCardById(cardId);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] += cardCost;
    }

    #unmarkCardById(cardId: string): void {
        this.cardset.unmarkCardById(cardId);
    }

    #selectId(cardId: string): void {
        this.#selectIds.push(cardId);
        this.#disabledIds.push(cardId);
    }

    #discountPointsById(cardId: string): void {
        if (!this.#colorsPoints) return;
        const card = this.cardset.getCardById(cardId);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] -= cardCost;
    }

    #isSelectLimitReached(): boolean {
        return (this.#selectionsNumber > 0) && (this.#selectIds.length >= this.#selectionsNumber);
    }

    #isAllIdsSelected(): boolean {
        return this.#selectIds.length === (this.cardset.getCardsTotal() - this.#disabledIds.length);
    }

    #noHasMoreColorPoints(): boolean {
        if (!this.#colorsPoints) return false;
        const cards = this.cardset.getCards();
        const avaliableCards = cards.filter((card: Card) => !this.#selectIds.includes(card.getId()));
        return avaliableCards.some((card: Card) => {
            return this.#isCardNoHasMorePoints(card);
        });
    }

    #disable() {
        this.#removeAllKeyboardListeners();
        this.reset();
        this.cardset.data.set('selectModeEnabled', false);
    }

    #removeAllKeyboardListeners() {
        const keyboard = this.#getKeyboard();
        keyboard.removeAllListeners();
    }

    getIdsSelected(): string[] {
        return this.#selectIds.slice();
    }

    #addOnKeydownEscListener(): void {
        const keyboard = this.#getKeyboard();
        const onKeydownEsc = () => {
            this.#disable();
            if (this.getIdsSelected().length > 0) {
                if (this.#events.onComplete) this.#events.onComplete(this.getIdsSelected());
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

    #deselectAll(): void {
        this.cardset.getCards().forEach((card: Card) => {
            this.#deselectCardById(card.getId());
        });
    }

    #unmarkAll(): void {
        this.cardset.getCards().forEach((card: Card) => {
            this.#unmarkCardById(card.getId());
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

    removeLastSeletedId(): void {
        if (this.#selectIds.length === 0) return;
        const lastId = this.#selectIds.pop();
        if (!lastId) return;
        this.#unmarkCardById(lastId);
        this.#creditPointsById(lastId);
        this.#removeDisabledById(lastId);
    }

}