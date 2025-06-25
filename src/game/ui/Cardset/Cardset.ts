import { Card } from "@/game/ui/Card/Card";
import { Dimensions } from "./Dimensions";
import { CardData } from "./CardData";
import { CardsetEvents } from "./CardsetEvents";

export class Cardset extends Phaser.GameObjects.Container {
    #mode: 'static' | 'select' = 'static';
    #events: CardsetEvents;

    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number,
        events: CardsetEvents
    ) {
        super(scene, x, y);
        this.#events = events;
        this.scene.add.existing(this);
    }

    static create(
        scene: Phaser.Scene, 
        dimensions: Dimensions,
        cardData: CardData[],
        events: CardsetEvents
    ): Cardset {
        const { x, y, width, height } = dimensions;
        const container = new Cardset(scene, x, y, events);
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