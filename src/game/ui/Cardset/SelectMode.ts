import { ORANGE } from "@/game/constants/colors";
import { ColorsPointsData } from "@objects/CardsFolderData";
import { Card } from "@ui/Card/Card";
import { Cardset } from "@ui/Cardset/Cardset";
import { CardsetEvents } from "@ui/Cardset/CardsetEvents";

export class SelectMode {
    #events: CardsetEvents;
    #index: number;
    #selectionsNumber: number;
    #colorsPoints: Partial<ColorsPointsData>;
    #selectIds: string[] = [];
    #disabledIds: string[] = [];

    constructor(readonly cardset: Cardset) {}

    create(events: CardsetEvents, selectionsNumber: number = 0, colorPoints: Partial<ColorsPointsData> = {}): void {
        this.#events = events;
        this.#colorsPoints = colorPoints;
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
        console.log(this.#disabledIds);
        // this.reset();
        this.#updateCardsState();
        this.#updateCursor();
        this.#addAllKeyboardListeners();
    }

    #updateCardsState(): void {
        this.cardset.getCards().forEach((card: Card) => {
            const cardId = card.getId();
            const cardColor = card.getColor();
            const isNotOrangeColor = cardColor !== ORANGE;
            // if (isNotOrangeColor && (this.#notHavePointsForCard(card) && !this.#disabledIds.includes(cardId))) {
            //     this.#disabledIds.push(cardId);
            // }
            // if (this.#disabledIds.includes(cardId)) {
            //     this.cardset.disableCardById(cardId);
            // }
            // if (this.#selectIds.includes(cardId)) {
            //     this.#markCardById(cardId);
            // }
        });
    }

    #updateCursor(newIndex: number = this.#getCurrentIndex()): void {
        if (!this.cardset.isValidIndex(newIndex)) return;
        this.#deselectCardByIndex(this.#getCurrentIndex());
        this.#changeIndex(newIndex);
        if (this.#events.onChangeIndex) this.#events.onChangeIndex(this.#getCurrentId());
        this.#selectCardByIndex(newIndex);
    }

    #getCurrentIndex(): number {
        return this.#index;
    }

    #deselectCardByIndex(index: number): void {
        this.#sendCardsToBackEqualOrLessByIndex(index);
        const cardId = this.#getIdByIndex(index);
        this.cardset.deselectCardById(cardId);
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
            if (this.#isIdSelected(currentId)) {
                // this.#removeId(currentId);
                // this.#creditPointsById(currentId);
                // if (this.#selectionsNumber !== 1) this.#unmarkCardById(currentId);
                return;
            }

            this.#selectId(currentId);
            this.#debitPointsById(currentId);
            this.cardset.disableCardById(currentId);
            // if (this.#selectionsNumber !== 1) this.#markCardById(currentId);
            if (this.#events.onMarked) this.#events.onMarked(currentId);


            // if (this.#isSelectLimitReached() || this.#isAllIdsSelected() || this.#noHasMoreColorPoints()) {
            //     this.#disable();
            //     if (this.#events.onComplete) this.#events.onComplete(this.getIdsSelected());
            // }
        };
        this.#getKeyboard().on('keydown-ENTER', onKeydownEnter);
    }

    #isCardDisabledById(cardId: string): boolean {
        console.log(
            this.#disabledIds,
            this.#selectIds,
            (this.#disabledIds.includes(cardId) && !this.#selectIds.includes(cardId)), 
            this.#disabledIds.includes(cardId),
            !this.#selectIds.includes(cardId),
            this.#getCurrentId()
        );
        return this.#disabledIds.includes(cardId) && !this.#selectIds.includes(cardId);
    }

    #selectId(cardId: string): void {
        const selectIds = this.#selectIds;
        const disabledIds = this.#disabledIds;
        this.#selectIds = [...new Set([...selectIds, cardId])];
        this.#disabledIds = [...new Set([...disabledIds, cardId])];
    }

    #debitPointsById(cardId: string): void {
        const card = this.#getCardById(cardId);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        console.log(this.#colorsPoints[cardColor] ? this.#colorsPoints[cardColor] - cardCost : 0);
        if (this.#colorsPoints[cardColor] && (this.#colorsPoints[cardColor] - cardCost >= 0)) {
            this.#colorsPoints[cardColor] -= cardCost;
            if (this.#events.onDebitPoint) this.#events.onDebitPoint(cardId);
        }
        console.log(this.#colorsPoints);
    }










    reset(): void {
        this.#unhighlightAll();
        this.#deselectAll();
        this.#unbanAll();
        this.#unmarkAll();
    }

    #unbanAll(): void {
        this.cardset.getCards().forEach((card: Card) => {
            this.#unbanCardById(card.getId());
        });
    }

    #unbanCardById(cardId: string): void {
        this.cardset.unbanCardById(cardId);
    }

    #deselectAll(): void {
        this.cardset.getCards().forEach((_card: Card, index: number) => {
            this.#deselectCardByIndex(index);
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

    #notHavePointsForCard(card: Card): boolean {
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        const points = this.#colorsPoints[cardColor] || 0;
        return points < cardCost;
    }

    #markCardById(cardId: string): void {
        this.cardset.markCardById(cardId);
        this.cardset.disableCardById(cardId);
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
        const card = this.#getCardById(cardId);
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        if (this.#colorsPoints[cardColor]) this.#colorsPoints[cardColor] += cardCost;
        if (this.#events.onCreditPoint) this.#events.onCreditPoint(cardId);
    }

    #unmarkCardById(cardId: string): void {
        this.cardset.unmarkCardById(cardId);
        this.cardset.enableCardById(cardId);
        this.cardset.selectCardById(cardId);
    }





    #isSelectLimitReached(): boolean {
        return (this.#selectionsNumber > 0) && (this.#selectIds.length >= this.#selectionsNumber);
    }

    #isAllIdsSelected(): boolean {
        return this.cardset.getCardsTotal() === ([...new Set([...this.#selectIds, ...this.#disabledIds])].length);
    }

    #noHasMoreColorPoints(): boolean {
        const cards = this.cardset.getCards();
        const avaliableCards = cards.filter((card: Card) => !this.#selectIds.includes(card.getId()));
        return avaliableCards.every((card: Card) => {
            return this.#notHavePointsForCard(card);
        });
    }





    getIdsSelected(): string[] {
        return this.#selectIds.slice();
    }



    removeLastSeletedId(): void {
        if (this.#selectIds.length === 0) return;
        const lastId = this.#selectIds.pop();
        if (!lastId) return;
        this.#removeDisabledById(lastId);
        this.#creditPointsById(lastId);
        this.#unmarkCardById(lastId);
        this.enable();
    }

}