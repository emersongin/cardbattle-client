import { Card } from "./Card";
import { ExpandCardConfig } from "./types/ExpandCardConfig";

export class ShrinkMove {
    
    constructor(readonly card: Card, config?: ExpandCardConfig) {
        this.card.scene.tweens.add({
            targets: this.card.getUi(), 
            x: card.getOriginX() + (card.getWidth() / 2),
            y: card.getOriginY() + (card.getHeight() / 2),
            scaleX: 0,
            scaleY: 0,
            ease: 'Linear',
            delay: config?.delay || 100,
            duration: config?.duration || 100,
            onComplete: () => {
                if (config?.onComplete) config.onComplete(card);
            },
        });
    }
}