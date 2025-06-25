import { Card } from "@/game/ui/Card";
import { Dimensions } from "./types/Dimensions";
import { CardData } from "./types/CardData";
import { CardsetEvents } from "./types/CardsetEvents";

export class Cardset extends Phaser.GameObjects.Container {
    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number,
        events: CardsetEvents
    ) {
        super(scene, x, y);
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