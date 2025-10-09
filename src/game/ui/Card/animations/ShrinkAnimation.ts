import { Card } from "@ui/Card/Card";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";

export class ShrinkAnimation {
    
    constructor(readonly card: Card, config: ExpandConfig) {
        const toX = card.getOriginX() + (card.getWidth() / 2);
        const toY = card.getOriginY() + (card.getHeight() / 2);
        this.card.scene.tweens.add({
            targets: this.card.getUi(), 
            x: toX,
            y: toY,
            scaleX: 0,
            scaleY: 0,
            ease: 'Linear',
            delay: config?.delay || 100,
            duration: config?.duration || 100,
            onComplete: () => {
                this.card.setX(toX);
                this.card.setY(toY);
                this.card.setScaleX(0);
                this.card.setScaleY(0);
                if (config?.onComplete) config.onComplete();
            },
        });
    }
}