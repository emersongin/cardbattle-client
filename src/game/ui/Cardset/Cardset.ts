import { Card } from "@ui/Card/Card";
import { Dimensions } from "./Dimensions";
import { CardData } from "../CardData";
import { CardsetEvents } from "./CardsetEvents";
import { CardsetState, StaticState, SelectState } from "./CardsetState";
import { ColorsPoints } from "../ColorsPoints";

export class Cardset extends Phaser.GameObjects.Container {
    #status: CardsetState;
    #cards: Card[] = [];

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
        this.#status = state;
    }

    selectMode(events: CardsetEvents, colorPoints: ColorsPoints, selectNumber: number = 0): void {
        this.changeState(new SelectState(this));
        if (!(this.#status instanceof SelectState)) return
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
}