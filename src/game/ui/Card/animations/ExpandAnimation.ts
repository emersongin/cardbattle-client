
import { Card } from "@ui/Card/Card";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";

export class ExpandAnimation {

    constructor(readonly card: Card, config?: ExpandConfig) {
        const toX = card.getOriginX() - (card.getWidth() * 0.25);
        const toY = card.getOriginY() - (card.getHeight() * 0.25);
        this.card.scene.tweens.add({
            targets: this.card.getUi().getMainLayer(),
            x: toX,
            y: toY,
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Linear',
            delay: config?.delay || 200,
            duration: config?.duration || 200,
            onComplete: () => {
                this.card.setX(toX);
                this.card.setY(toY);
                this.card.setScaleX(1.5);
                this.card.setScaleY(1.5);
                if (config?.onComplete) config.onComplete();
            },
        });
    }

}