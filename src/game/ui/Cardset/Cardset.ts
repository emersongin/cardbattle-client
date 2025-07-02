import { Card } from "@/game/ui/Card/Card";
import { Dimensions } from "./Dimensions";
import { CardData } from "./CardData";
import { CardsetEvents } from "./CardsetEvents";
import { CardsetState } from "./CardsetState";
import StaticState from "./StaticState";
import SelectState from "./SelectState";

export class Cardset extends Phaser.GameObjects.Container {
    #status: CardsetState;
    #events: CardsetEvents;
    #cards: Card[] = [];

    private constructor(
        readonly scene: Phaser.Scene, 
        dimensions: Dimensions,
        cards: CardData[] = []
    ) {
        const { x, y, width, height } = dimensions;
        super(scene, x, y);
        this.setSize(width, height);
        this.createCards(cards);
        this.addChildrenInline();
        this.changeState(new StaticState(this), this.#events);
        this.scene.add.existing(this);
    }

    private createCards(cards: CardData[]): void {
        const cardsUi = cards.map((data: CardData) => Card.create(this.scene, data));
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

    changeState(state: CardsetState, ...args: any[]): void {
        this.#status = state;
        this.#status.create(...args);
    }

    static createSelectMove(
        scene: Phaser.Scene, 
        dimensions: Dimensions,
        cardData: CardData[],
        events: CardsetEvents
    ): Cardset {
        const cardset = new Cardset(scene, dimensions, cardData);
        cardset.selectMode(events);
        return cardset;
    }

    selectMode(events: CardsetEvents): void {
        this.setEvents(events);
        this.changeState(new SelectState(this), this.#events);
    }

    private setEvents(events?: CardsetEvents): void {
        if (!events) return;
        this.#events = events;
    }

    getCardsTotal(): number {
        return this.#cards.length;
    }
}