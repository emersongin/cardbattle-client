import { Card } from "@ui/Card/Card";
import { CardsetEvents } from "./CardsetEvents";
import { CardUi } from "../Card/CardUi";
import { Scene } from "phaser";
import { CARD_HEIGHT, CARD_WIDTH } from "@game/constants/default";
import { CardActionsBuilder } from "../Card/CardActionsBuilder";
import { SelectMode } from "./SelectMode";
import { CardData } from "@/game/objects/CardData";
import { ColorsPointsData } from "@/game/objects/CardsFolderData";

export class Cardset extends Phaser.GameObjects.Container {
    #cards: Card[] = [];
    #selectedTweens: Phaser.Tweens.Tween[];
    #selectMode: SelectMode;

    constructor(
        readonly scene: Scene, 
        readonly cards: CardData[],
        x: number = 0,
        y: number = 0,
        faceUp: boolean = false
    ) {
        super(scene, x, y);
        this.setDataEnabled();
        this.data.set('selectModeEnabled', false);
        this.setSize(cards.length * CARD_WIDTH, CARD_HEIGHT);
        this.#selectMode = new SelectMode(this);
        this.#createCards(cards, faceUp);
        this.scene.add.existing(this);
    }

    static create(
        scene: Scene,
        cards: CardData[],
        x: number = 0,
        y: number = 0,
        faceUp: boolean = false
    ): Cardset {
        return new Cardset(scene, cards, x, y, faceUp);
    }

    setCardsInLinePosition(x: number = 0, y: number = 0): void {
        this.getCards().forEach((card: Card, index: number) => {
            let padding = Math.max(0, Math.abs(this.width / this.#cards.length));
            if (padding > card.getWidth()) padding = card.getWidth();
            card.setPosition(x + (padding * index), y);
            card.updateOrigin();
        });
    }

    setCardAtPosition(index: number, x: number = 0, y: number = 0): void {
        if (!this.isValidIndex(index)) {
            throw new Error(`Cardset: index ${index} is out of bounds.`);
        }
        const card = this.getCardByIndex(index);
        card.setPosition(x, y);
        card.updateOrigin();
    }

    getCards(): Card[] {
        return this.#cards;
    }

    getCardsUi(): CardUi[] {
        return this.getCards().map((card: Card) => card.getUi());
    }

    getCardByIndex(index: number): Card {
        if (!this.isValidIndex(index)) {
            throw new Error(`Cardset: index ${index} is out of bounds.`);
        }
        return this.#cards[index];
    }

    getCardById(cardId: string): Card {
        const card = this.#cards.find((card: Card) => card.getId() === cardId);
        if (!card) {
            throw new Error(`Cardset: card with id ${cardId} not found.`);
        }
        return card;
    }

    getCardsByFromTo(start: number, end: number): Card[] {
        if (!this.isValidIndex(start) || !this.isValidIndex(end))
            throw new Error(`Cardset: index ${start} or ${end} is out of bounds.`);
        if (start > end) {
            throw new Error(`Cardset: start index ${start} cannot be greater than end index ${end}.`);
        }
        return this.#cards.slice(start, end + 1);
    }

    getCardsByIndexes(indexes: number[]): Card[] {
        return indexes.map((index: number) => {
            if (!this.isValidIndex(index)) {
                throw new Error(`Cardset: index ${index} is out of bounds.`);
            }
            return this.#cards[index];
        });
    }

    getCardsTotal(): number {
        return this.getCards().length;
    }

    getCardsLastIndex(): number {
        return this.getCardsTotal() - 1;
    }

    getIndexesToArray(): number[] {
        return this.getCards().map((_card: Card, index: number) => index);
    }

    getSelectIndexes(): number[] {
        return this.#selectMode.getSelectIndexes();
    }

    disableBattleCards(): void {
        const cards = this.getCards();
        cards.forEach((card: Card, index: number) => {
            if (card.isBattleCard()) {
                this.disableCardByIndex(index);
            }
        });
    }

    disableCardByIndex(index: number): void {
        const card = this.getCardByIndex(index);
        card.disable();
    }

    disablePowerCards(): void {
        const cards = this.getCards();
        cards.forEach((card: Card, index: number) => {
            if (card.isPowerCard()) {
                this.disableCardByIndex(index);
            }
        });
    }

    #stopSelectedTweens(): void {
        if (this.#selectedTweens) {
            this.#selectedTweens?.forEach(tween => tween.stop());
            this.#selectedTweens = [];
        }
    }

    selectCard(card: Card): void {
        card.select();
        this.bringToTop(card.getUi());
        this.#stopSelectedTweens();
    }

    deselectCard(card: Card): void {
        card.deselect();
        this.#stopSelectedTweens();
    }

    markCard(card: Card): void {
        card.mark();
        this.#stopSelectedTweens();
    }

    unmarkCard(card: Card): void {
        card.unmark();
        this.#stopSelectedTweens();
    }

    unhighlightCard(card: Card): void {
        card.unhighlight();
        this.#stopSelectedTweens();
    }

    highlightCardsByIndexes(cardIndexes: number[]): void {
        this.getCards().forEach((card: Card, index: number) => {
            if (cardIndexes.includes(index)) {
                card.highlight();
            }
        });
    }

    openAllCardsDominoMovement(): void {
        this.getCards().forEach((card: Card, index: number) => {
            const delay = (index * 100);
            const duration = 100;
            CardActionsBuilder
                .create(card)
                .open({ open: true, delay, duration })
                .play();
        });
    }

    closeAllCardsDominoMovement(): void {
        this.getCards().forEach((card: Card, index: number) => {
            const delay = (index * 100);
            const duration = 100;
            CardActionsBuilder
                .create(card)
                .close({ open: false, delay, duration })
                .play();
        });
    }

    restoreSelectMode(): void {
        this.#selectMode.removeLastSeletedIndex();
        this.#selectMode.enable();
    }

    resetCardsState(): void {
        this.#selectMode.reset();
    }

    isValidIndex(index: number) {
        return index >= 0 && index <= this.#cards.length - 1;
    }

    selectModeOne(events: CardsetEvents): void {
        const selectionsNumber = 1;
        this.#selectMode.create(events, selectionsNumber);
    }

    selectModeMany(events: CardsetEvents, colorPoints?: ColorsPointsData): void {
        const selectionsNumber = 0;
        this.#selectMode.create(events, selectionsNumber, colorPoints);
    }

    #createCards(cardsData: CardData[], faceUp: boolean = false): void {
        const cards = cardsData.map((cardData: CardData) => {
            const card = new Card(this.scene, this, cardData, faceUp);
            return card;
        });
        this.#cards = cards;
    }

    preUpdate(): void {
        this.#preUpdateSelectedTweens();
    }

    #preUpdateSelectedTweens(): void {
        if (!this.#selectedTweens || !this.#selectedTweens?.some(tween => tween.isPlaying())) {
            const selectedTargets: Phaser.GameObjects.Graphics[] = [];
            this.getCards().forEach((card: Card) => {
                if (card.isSelected() || card.isMarked() || card.isHighlighted()) {
                    const colorLayer = card.getSelectedLayer().list[1] as Phaser.GameObjects.Graphics;
                    selectedTargets.push(colorLayer);
                }
            });
            if (selectedTargets.length) {
                this.#selectedTweens = this.scene.tweens.addMultiple(selectedTargets.map((target: Phaser.GameObjects.Graphics) => ({
                    targets: target,
                    alpha: { from: 0.5, to: 1 },
                    duration: 300,
                    ease: 'Linear',
                    yoyo: true,
                    repeat: -1,
                })));
            }
        }
    }

    setCardsClosed(): void {
        this.getCards().forEach((card: Card) => {
            card.setClosed();
        });
    }

    setCardClosedByIndex(index: number): void {
        if (!this.isValidIndex(index)) {
            throw new Error(`Cardset: index ${index} is out of bounds.`);
        }
        const card = this.getCardByIndex(index);
        card.setClosed();
    }

    isOpened(): boolean {
        return this.getCards().some((card: Card) => card.isOpened());
    }

    removeCardById(cardId: string): void {
        const cardIndex = this.#cards.findIndex((card: Card) => card.getId() === cardId);
        if (cardIndex === -1) {
            throw new Error(`Cardset: card with id ${cardId} not found.`);
        }
        this.remove(this.#cards[cardIndex].getUi(), true);
        this.#cards.splice(cardIndex, 1);
    }

    isSelectModeEnabled(): boolean {
        return this.data.get('selectModeEnabled') === true;
    }

    isSelectModeDisabled(): boolean {
        return this.data.get('selectModeEnabled') === false;
    }
}