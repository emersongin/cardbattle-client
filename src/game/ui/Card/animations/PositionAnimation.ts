
import { Card } from "@ui/Card/Card";
import { PositionConfig } from "@ui/Card/animations/types/PositionConfig";

export class PositionAnimation {

    constructor(readonly card: Card, config: PositionConfig) {
        const tweens = [
            { 
                x: config?.fromX || this.card.getX() || 0, 
                y: config?.fromY || this.card.getY() || 0, 
                delay: 0,
                duration: 0 
            },
            {
                x: config.toX, 
                y: config.toY,
                delay: config?.delay || 0,
                duration: config?.duration || 500,
                onStart: config?.onStart,
                onComplete: () => {
                    if (config.onComplete) config.onComplete();
                    this.card.updateOrigin(this.card.getX(), this.card.getY());
                }
            }
        ];
        this.card.scene.tweens.chain({ 
            targets: this.card.getUi(), 
            tweens: tweens,
        });
    }

}