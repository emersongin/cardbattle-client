import { Card } from "@ui/Card/Card";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";

export class ShrinkAnimation {
    
    constructor(readonly card: Card, config: ExpandConfig) {
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
                if (config?.onComplete) config.onComplete();
            },
        });
    }
}