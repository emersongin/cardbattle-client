import { CardUi } from "@/game/ui/CardUi";

export class CardContainer extends Phaser.GameObjects.Container {
    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number
    ) {
        super(scene, x, y);
        this.scene.add.existing(this);
    }

    static create(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        width: number,
        height: number,
        children: CardUi[]
    ): CardContainer {
        const container = new CardContainer(scene, x, y);
        container.setSize(width, height);
        children.forEach((child: CardUi, index: number) => {
            let padding = Math.max(0, Math.abs(container.width / children.length));
            if (padding > child.width) padding = child.width;
            child.x = padding * index;
            child.y = 0;
            container.add(child);
        });
        return container;
    }
}