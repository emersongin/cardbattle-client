import { Card } from "@ui/Card/Card";
import { Dimensions } from "./Dimensions";
import { CardData } from "../CardData";
import { CardsetEvents } from "./CardsetEvents";
import { CardsetState, StaticState, SelectState } from "./CardsetState";
import { ColorsPoints } from "../ColorsPoints";

export class Cardset extends Phaser.GameObjects.Container {
    #status: CardsetState;
    #lastState: CardsetState | null = null;
    #cards: Card[] = [];
    #selectedTweens: Phaser.Tweens.Tween[];
    #markedTweens: Phaser.Tweens.Tween[];
    #highlightedTweens: Phaser.Tweens.Tween[];

    constructor(
        readonly scene: Phaser.Scene, 
        dimensions: Dimensions,
        cards: CardData[] = []
    ) {
        const { x, y, width, height } = dimensions;
        super(scene, x, y);
        this.setSize(width, height);
        this.createCards(cards);
        this.addChildrenInline();
        this.changeState(new StaticState(this));
        this.scene.add.existing(this);
    }

    private createCards(cards: CardData[]): void {
        const cardsUi = cards.map((data: CardData) => new Card(this.scene, data));
        this.#cards = cardsUi;
    }

    private addChildrenInline(): void {
        if (this.#cards.length === 0) return;
        this.#cards.forEach((child: Card, index: number) => {
            let padding = Math.max(0, Math.abs(this.width / this.#cards.length));
            if (padding > child.width) padding = child.width;
            child.x = padding * index;
            child.y = 0;
            this.add(child);
        });
    }

    changeState(state: CardsetState): void {
        this.#lastState = this.#status;
        this.#status = state;
    }

    selectModeOne(events: CardsetEvents): void {
        this.#selectMode(events, null, 1);
    }

    selectModeMany(events: CardsetEvents, colorPoints: ColorsPoints): void {
        this.#selectMode(events, colorPoints, 0);
    }

    #selectMode(events: CardsetEvents, colorPoints?: ColorsPoints | null, selectNumber: number = 0): void {
        this.changeState(new SelectState(this));
        if ((this.#status instanceof SelectState) === false) return;
        this.#status.create(events, colorPoints, selectNumber);
    }

    getCardListByInterval(start: number, end: number): Card[] {
        if (!this.isValidIndex(start) || !this.isValidIndex(end))
            throw new Error(`Cardset: index ${start} or ${end} is out of bounds.`);
        if (start > end) {
            throw new Error(`Cardset: start index ${start} cannot be greater than end index ${end}.`);
        }
        return this.#cards.slice(start, end + 1);
    }

    getCardByIndex(index: number): Card {
        if (!this.isValidIndex(index)) {
            throw new Error(`Cardset: index ${index} is out of bounds.`);
        }
        return this.#cards[index];
    }

    isValidIndex(index: number) {
        return index >= 0 && index <= this.#cards.length - 1;
    }

    getCards(): Card[] {
        return this.#cards;
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

    getIndexesToArray(): number[] {
        return this.getCards().map((_card: Card, index: number) => index);
    }

    disableBattleCards(): void {
        if (!(this.#status instanceof SelectState)) return
        this.#status.disableBattleCards();
    }

    disablePowerCards(): void {
        if (!(this.#status instanceof SelectState)) return
        this.#status.disablePowerCards();
    }

    isStaticMode(): boolean {
        return this.#status instanceof StaticState;
    }

    isSelectMode(): boolean {
        return this.#status instanceof SelectState;
    }

    restoreSelectState(): void {
        if (!this.#lastState || (this.#lastState instanceof SelectState) === false) return;
        this.changeState(this.#lastState);
        if ((this.#status instanceof SelectState) === false) return;
        this.#status.removeSelectLastIndex();
        this.#status.enable();
    }

    getSelectIndexes(): number[] {
        if (!(this.#status instanceof SelectState)) return [];
        return this.#status.getSelectIndexes();
    }

    highlightCardsByIndexes(cardIndexes: number[]): void {
        this.getCards().forEach((card: Card, index: number) => {
            if (cardIndexes.includes(index)) {
                card.highlight();
            }
        });
    }

    closeAllCards(): void {
        this.getCards().forEach((card: Card) => {
            card.close();
        });
    }

    closeAllCardsDomino(): void {
        let delay = 0;
        this.getCards().forEach((card: Card, index: number) => {
            delay += (index * 24);
            card.close(() => true, () => {}, delay);
        });
    }

    resetCardsState(): void {
        if (!(this.#status instanceof SelectState)) return;
        this.#status.resetCardsState();
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
                    markedTargets.push(card.getMarkedLayer());
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
                    highlightedTargets.push(card.getHighlightedLayer());
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

    preUpdate(): void {
        this.#preUpdateSelectedTweens();
        this.#preUpdateMarkedTweens();
        this.#preUpdateHighlightedTweens();
    }

    selectCard(card: Card): void {
        card.select();
        this.bringToTop(card);
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
}