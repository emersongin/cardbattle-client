import { Card } from "@ui/Card/Card";
import { CardsetEvents } from "./types/CardsetEvents";
import { CardsetState, StaticState, SelectState } from "./state/CardsetState";
import { ColorsPoints } from "../../types/ColorsPoints";
import { CardData } from "@game/types";
import { CardUi } from "../Card/CardUi";
import { Scene } from "phaser";
import { CARD_HEIGHT, CARD_WIDTH } from "@/game/constants/default";

export class Cardset extends Phaser.GameObjects.Container {
    #status: CardsetState;
    #lastState: CardsetState | null = null;
    #cards: Card[] = [];
    #selectedTweens: Phaser.Tweens.Tween[];
    #markedTweens: Phaser.Tweens.Tween[];
    #highlightedTweens: Phaser.Tweens.Tween[];

    constructor(
        readonly scene: Scene, 
        readonly cards: CardData[],
        x: number = 0,
        y: number = 0,
    ) {
        super(scene, x, y);
        this.setSize(cards.length * CARD_WIDTH, CARD_HEIGHT);
        this.changeState(new StaticState(this));
        this.#createCards(cards);
        this.scene.add.existing(this);
    }

    static create(
        scene: Scene,
        cards: CardData[],
        x: number = 0,
        y: number = 0
    ): Cardset {
        return new Cardset(scene, cards, x, y);
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
        return this.#status.getSelectIndexes();
    }

    changeState(state: CardsetState, ...args: any[]): void {
        this.#lastState = this.#status;
        this.#status = state;
        if (this.#status.create) this.#status.create(...args);
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

    selectCard(card: Card): void {
        card.select();
        this.bringToTop(card.getUi());
        if (this.#selectedTweens) this.#selectedTweens.forEach(tween => tween.stop());
    }

    deselectCard(card: Card): void {
        card.deselect();
        if (this.#selectedTweens) this.#selectedTweens?.forEach(tween => tween.stop());
    }

    markCard(card: Card): void {
        card.mark();
        if (this.#markedTweens) this.#markedTweens.forEach(tween => tween.stop());
    }

    unmarkCard(card: Card): void {
        card.unmark();
        if (this.#markedTweens) this.#markedTweens.forEach(tween => tween.stop());
    }

    unhighlightCard(card: Card): void {
        card.unhighlight();
        if (this.#highlightedTweens) this.#highlightedTweens.forEach(tween => tween.stop());
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
            card.open({ delay, duration });
        });
    }

    closeAllCardsDominoMovement(): void {
        this.getCards().forEach((card: Card, index: number) => {
            const delay = (index * 100);
            const duration = 100;
            card.close({ delay, duration });
        });
    }

    restoreSelectState(): void {
        if (this.#lastState instanceof SelectState) {
            this.#status = this.#lastState;
            this.#status.removeSelectLastIndex();
            this.#status.enable();
        }
    }

    resetCardsState(): void {
        this.#status.resetCardsState();
    }

    isValidIndex(index: number) {
        return index >= 0 && index <= this.#cards.length - 1;
    }

    selectModeOne(events: CardsetEvents): void {
        this.#status.selectMode({ events, selectNumber: 1 });
    }

    selectModeMany(events: CardsetEvents, colorPoints?: ColorsPoints): void {
        this.#status.selectMode({ 
            events, 
            colorPoints, 
            selectNumber: 0 
        });
    }

    #createCards(cardsData: CardData[]): void {
        const cards = cardsData.map((data: CardData) => {
            const card = new Card(this.scene, this, data);
            return card;
        });
        this.#cards = cards;
    }

    preUpdate(): void {
        this.#preUpdateCards();
        this.#preUpdateSelectedTweens();
        this.#preUpdateMarkedTweens();
        this.#preUpdateHighlightedTweens();
    }

    #preUpdateCards(): void {
        this.getCards().forEach((card: Card) => card.preUpdate());
    }

    #preUpdateSelectedTweens(): void {
        if (!this.#selectedTweens || !this.#selectedTweens?.some(tween => tween.isPlaying())) {
            const selectedTargets: Phaser.GameObjects.Graphics[] = [];
            this.getCards().forEach((card: Card) => {
                if (card.isSelected()) {
                    selectedTargets.push(card.getSelectedLayer());
                }
            });
            if (selectedTargets.length) {
                this.#selectedTweens = this.scene.tweens.addMultiple(selectedTargets.map((target: Phaser.GameObjects.Graphics) => ({
                    targets: target,
                    alpha: { from: 0.4, to: 0.9 },
                    duration: 500,
                    ease: 'Linear',
                    yoyo: true,
                    repeat: -1,
                })));
            }
        }
    }

    #preUpdateMarkedTweens(): void {
        if (!this.#markedTweens || !this.#markedTweens?.some(tween => tween.isPlaying())) {
            const markedTargets: Phaser.GameObjects.Graphics[] = [];
            this.getCards().forEach((card: Card) => {
                if (card.isMarked()) {
                    markedTargets.push(card.getSelectedLayer());
                }
            });
            if (markedTargets.length) {
                this.#markedTweens = this.scene.tweens.addMultiple(markedTargets.map((target: Phaser.GameObjects.Graphics) => ({
                    targets: target,
                    alpha: { from: 0.7, to: 0.9 },
                    duration: 500,
                    ease: 'Linear',
                    yoyo: true,
                    repeat: -1,
                })));
            }
        }
    }

    #preUpdateHighlightedTweens(): void {
        if (!this.#highlightedTweens || !this.#highlightedTweens?.some(tween => tween.isPlaying())) {
            const highlightedTargets: Phaser.GameObjects.Graphics[] = [];
            this.getCards().forEach((card: Card) => {
                if (card.isHighlighted()) {
                    highlightedTargets.push(card.getSelectedLayer());
                }
            });
            if (highlightedTargets.length) {
                this.#highlightedTweens = this.scene.tweens.addMultiple(highlightedTargets.map((target: Phaser.GameObjects.Graphics) => ({
                    targets: target,
                    alpha: { from: 0.4, to: 0.9 },
                    duration: 500,
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
}