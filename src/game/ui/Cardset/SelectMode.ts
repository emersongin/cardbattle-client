import { ColorsPointsData } from "@objects/CardsFolderData";
import { Card } from "@ui/Card/Card";
import { Cardset } from "@ui/Cardset/Cardset";
import { CardsetEvents } from "@ui/Cardset/CardsetEvents";
import { CardActionsBuilder } from "@ui/Card/CardActionsBuilder";

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
        this.#setCardsDisabled();
        this.enable();
    }

    #setCardsDisabled(): void {
        this.cardset.getCards().forEach((card: Card) => {
            if (card.isDisabled()) this.#disabledIds.push(card.getId());
        });
    }

    getIdsSelected(): string[] {
        return this.#selectIds.slice();
    }

    removeLastSeletedId(): void {
        if (this.#selectIds.length === 0) return;
        const lastId = this.#selectIds.pop();
        if (!lastId) return;
        this.#unmarkCard(this.#getCardById(lastId));
        this.#creditPointsById(lastId);
        this.#removeDisabledById(lastId);
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
            const currentId = this.#getCurrentId();
            if (!this.#isCardAvaliableById(currentId)) return;
            if (this.#isIdSelected(currentId)) {
                this.#removeId(currentId);
                this.#creditPointsById(currentId);
                this.#unmarkCard(this.#getCardById(currentId));
                return;
            }
            this.#selectIndex(currentId);
            this.#discountPointsById(currentId);
            if (this.#selectionsNumber !== 1) this.#markCard(this.#getCardById(currentId));
            if (this.#events.onMarked) this.#events.onMarked(currentId);
            if (this.#isSelectLimitReached() || this.#isSelectAll() || this.#isNoHasMoreColorsPoints()) {
                this.#disable();
                if (this.#events.onComplete) this.#events.onComplete(this.getIdsSelected());
            }
        };
        keyboard.on('keydown-ENTER', onKeydownEnter);
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
                this.#markCard(this.#getCardById(cardId));
            }
        });
    }

    #getCardById(cardId: string): Card {
        return this.cardset.getCardById(cardId)
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

    #getCurrentId(): string {
        return this.cardset.getCardByIndex(this.#getCurrentIndex()).getId();
    }

    #getCurrentIndex(): number {
        return this.#index;
    }

    #disable() {
        this.#removeAllKeyboardListeners();
        this.reset();
        this.cardset.data.set('selectModeEnabled', false);
    }

    #isCardAvaliableById(cardId: string): boolean {
        return !this.#disabledIds.includes(cardId) || this.#selectIds.includes(cardId);
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
        const card = this.#getCardById(cardId);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] += cardCost;
    }

    #unmarkCard(card: Card): void {
        this.cardset.unmarkCard(card);
    }

    #selectIndex(cardId: string): void {
        this.#selectIds.push(cardId);
        this.#disabledIds.push(cardId);
    }

    #discountPointsById(cardId: string): void {
        if (!this.#colorsPoints) return;
        const card = this.#getCardById(cardId);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        this.#colorsPoints[cardColor] -= cardCost;
    }

    #markCard(card: Card): void {
        this.cardset.markCard(card);
        card.disable();
    }

    #isSelectLimitReached(): boolean {
        return (this.#selectionsNumber > 0) && (this.#selectIds.length >= this.#selectionsNumber);
    }

    #isSelectAll(): boolean {
        return this.#selectIds.length === (this.cardset.getCardsTotal() - this.#disabledIds.length);
    }

    #isNoHasMoreColorsPoints(): boolean {
        if (!this.#colorsPoints) return false;
        const cards = this.cardset.getCards();
        const avaliableCards = cards.filter((card: Card) => !this.#selectIds.includes(card.getId()));
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