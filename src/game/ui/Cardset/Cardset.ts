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

    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number,
        events?: CardsetEvents
    ) {
        super(scene, x, y);
        this.setEvents(events);
        this.changeState(new StaticState(this), this.#events);
        this.scene.add.existing(this);
    }

    private setEvents(events?: CardsetEvents): void {
        if (!events) return;
        this.#events = events;
    }

    static createSelectMove(
        scene: Phaser.Scene, 
        dimensions: Dimensions,
        cardData: CardData[],
        events: CardsetEvents
    ): Cardset {
        const { x, y, width, height } = dimensions;
        const cardset = new Cardset(scene, x, y, events);
        cardset.setSize(width, height);
        const cardsUi = cardData.map((data: CardData) => Card.create(scene, data));
        cardsUi.forEach((child: Card, index: number) => {
            let padding = Math.max(0, Math.abs(cardset.width / cardData.length));
            if (padding > child.width) padding = child.width;
            child.x = padding * index;
            child.y = 0;
            cardset.add(child);
        });
        cardset.selectMode();
        return cardset;
    }

    selectMode(events?: CardsetEvents): void {
        this.setEvents(events);
        this.changeState(new SelectState(this), this.#events);
    }

    changeState(state: CardsetState, ...args: any[]): void {
        this.#status = state;
        this.#status.create(...args);
    }

    static create(
        scene: Phaser.Scene, 
        dimensions: Dimensions,
        cardData: CardData[]
    ): Cardset {
        const { x, y, width, height } = dimensions;
        const container = new Cardset(scene, x, y);
        container.setSize(width, height);
        const cardsUi = cardData.map((data: CardData) => Card.create(scene, data));
        cardsUi.forEach((child: Card, index: number) => {
            let padding = Math.max(0, Math.abs(container.width / cardData.length));
            if (padding > child.width) padding = child.width;
            child.x = padding * index;
            child.y = 0;
            container.add(child);
        });
        return container;
    }
}