import Phaser from "phaser";
import { CARD_HEIGHT, CARD_WIDTH } from "@constants/default";
import { Card } from "@ui/Card/Card";
import { CardUi } from "@ui/Card/CardUi";
import { CardActionsBuilder } from "@ui/Card/CardActionsBuilder";
import { CardsetEvents } from "@ui/Cardset/CardsetEvents";
import { SelectMode } from "@ui/Cardset/SelectMode";
import { MoveConfig } from "@ui/Card/animations/types/MoveConfig";
import { VueScene } from "@game/scenes/VueScene";

export class Cardset extends Phaser.GameObjects.Container {
    #cards: Card[] = [];
    #selectedTweens: Phaser.Tweens.Tween[];
    #selectMode: SelectMode;

    private constructor(
        readonly scene: VueScene, 
        readonly cards: Card[],
        x: number = 0,
        y: number = 0
    ) {
        super(scene, x, y);
        this.setDataEnabled();
        this.data.set('selectModeEnabled', false);
        this.setSize(cards.length * CARD_WIDTH, CARD_HEIGHT);
        this.#selectMode = new SelectMode(this);
        this.#setCards(cards);
        this.#addCards();
        this.scene.add.existing(this);
    }

    static create(
        scene: VueScene,
        cards: Card[],
        x: number = 0,
        y: number = 0
    ): Cardset {
        return new Cardset(scene, cards, x, y);
    }

    setCardsInLinePosition(x: number = 0, y: number = 0): void {
        const cards = this.getCards();
        const numCards = cards.length;
        let padding = Math.max(0, Math.abs(this.width / numCards));
        if (padding > CARD_WIDTH) padding = CARD_WIDTH;
        cards.forEach((card: Card, index: number) => {
            card.setPosition(x + (padding * index), y);
        });
    }

    setCardAtThePosition(index: number, x: number = 0, y: number = 0): void {
        if (!this.isValidIndex(index)) {
            throw new Error(`Cardset: index ${index} is out of bounds.`);
        }
        const card = this.getCardByIndex(index);
        card.setPosition(x, y);
    }

    setFaceDownAllCards(): void {
        this.getCards().forEach(card => card.faceDown());
    }

    setShrinkAllCards(): void {
        this.getCards().forEach(card => card.setShrinked());
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
        return this.getCards()[index];
    }

    getCardById(cardId: string): Card {
        return this.getCards().find((card: Card) => card.getId() === cardId) as Card;
    }

    getCardsBySlice(start: number, end: number): Card[] {
        if (!this.isValidIndex(start) || !this.isValidIndex(end)) {
            throw new Error(`Cardset: index ${start} or ${end} is out of bounds.`);
        }
        if (start > end) {
            throw new Error(`Cardset: start index ${start} cannot be greater than end index ${end}.`);
        }
        return this.getCards().slice(start, end + 1);
    }

    getCardsTotal(): number {
        return this.getCards().length;
    }

    getCardsLastIndex(): number {
        return this.getCardsTotal() - 1;
    }

    disableCardById(cardId: string): void {
        this.getCardById(cardId).disable();
    }

    enableCardById(cardId: string): void {
        const card = this.getCardById(cardId);
        card.enable();
    }

    #stopSelectedTweens(): void {
        if (this.#selectedTweens) {
            this.#selectedTweens?.forEach(tween => tween.stop());
            this.#selectedTweens = [];
        }
    }

    selectCardById(cardId: string): void {
        this.removeAllSelectCardById(cardId);
        const card = this.getCardById(cardId);
        this.bringToTop(card.getUi());
        if (card.isMarked()) return this.markCardById(cardId);
        if (card.isHighlighted()) return;
        if (card.isDisabled()) return this.banCardById(cardId);
        card.select();
        this.#stopSelectedTweens();
    }

    banCardById(cardId: string): void {
        this.removeAllSelectCardById(cardId);
        this.getCardById(cardId).ban();
    }

    markCardById(cardId: string): void {
        this.removeAllSelectCardById(cardId);
        this.getCardById(cardId).mark();
    }

    highlightCardsById(cardId: string): void {
        this.removeAllSelectCardById(cardId);
        this.getCardById(cardId).highlight();
    }

    removeAllSelectCardById(cardId: string): void {
        const card = this.getCardById(cardId);
        card.unhighlight();
        card.unmark();
        card.deselect();
        card.unban();
        this.#stopSelectedTweens();
    }

    removeAllSelect(): void {
        this.getCards().forEach((card: Card) => {
            const cardId = card.getId();
            this.removeAllSelectCardById(cardId);
        });
    }

    showCards(): void {
        this.getCards().forEach((card: Card) => card.setOpened());
    }

    // openAllCardsDominoMovement(): void {
    //     this.getCards().forEach((card: Card, index: number) => {
    //         const delay = (index * 100);
    //         const duration = 100;
    //         CardActionsBuilder
    //             .create(card)
    //             .open({ delay, duration })
    //             .play();
    //     });
    // }

    // closeAllCardsDominoMovement(): void {
    //     this.getCards().forEach((card: Card, index: number) => {
    //         const delay = (index * 100);
    //         const duration = 100;
    //         CardActionsBuilder
    //             .create(card)
    //             .close({ delay, duration })
    //             .play();
    //     });
    // }

    restoreSelectMode(): void {
        this.#selectMode.restoreSelectMode();
    }

    isValidIndex(index: number) {
        return index >= 0 && index <= this.getCards().length - 1;
    }

    selectModeOne(events: CardsetEvents): void {
        const selectionsNumber = 1;
        this.#selectMode.create(events, selectionsNumber);
    }

    selectModeMany(events: CardsetEvents): void {
        const selectionsNumber = 0;
        this.#selectMode.create(events, selectionsNumber);
    }

    #setCards(cards: Card[]): void {
        this.#cards = cards;
    }

    #addCards(): void {
        this.getCards().forEach((card: Card) => this.add(card.getUi()));
    }

    preUpdate(): void {
        this.#preUpdateSelectedTweens();
    }

    #preUpdateSelectedTweens(): void {
        if (!this.#selectedTweens || !this.#selectedTweens?.some(tween => tween.isPlaying())) {
            const selectedTargets: Phaser.GameObjects.Graphics[] = [];
            this.getCards().forEach((card: Card) => {
                if (card.isSelected() || card.isMarked() || card.isHighlighted() || card.isBanned()) {
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
        const cardIndex = this.getCards().findIndex((card: Card) => card.getId() === cardId);
        if (cardIndex === -1) {
            throw new Error(`Cardset: card with id ${cardId} not found.`);
        }
        this.remove(this.getCards()[cardIndex].getUi(), true);
        this.getCards().splice(cardIndex, 1);
    }

    isSelectModeEnabled(): boolean {
        return this.data.get('selectModeEnabled') === true;
    }

    isSelectModeDisabled(): boolean {
        return this.data.get('selectModeEnabled') === false;
    }

    moveCardById(cardId: string, config: Partial<MoveConfig>): void {
        const card = this.getCardById(cardId);
        CardActionsBuilder
            .create(card)
            .move({
                fromX: config?.xFrom ?? card.getX(),
                fromY: config?.yFrom ?? card.getY(),
                toX: config?.xTo ?? card.getX(),
                toY: config?.yTo ?? card.getY(),
                duration: config?.duration || 0,
            })
            .play();
    }

    getCardIndexById(cardId: string): number {
        return this.getCards().findIndex((card: Card) => card.getId() === cardId);
    }

}