
import { Card } from "../Card";
import { CardScaleMoveConfig } from "./types/CardScaleMoveConfig";

export class ScaleAnimation {

    constructor(readonly card: Card, config: CardScaleMoveConfig) {
        // this.card.updateOrigin();
        if (config?.open) {
            this.card.scene.tweens.add({ 
                targets: this.card.getUi(), 
                x: card.getOriginX(),
                scaleX: 1,
                ease: 'Linear',
                onComplete: () => {
                    if (config.onComplete) config.onComplete(this.card);
                },
                delay: config.delay || 0,
                duration: config.duration || 100,
            });
            return;
        }
        this.card.scene.tweens.add({ 
            targets: this.card.getUi(), 
            x: card.getX() + (card.getWidth() / 2),
            scaleX: 0,
            ease: 'Linear',
            onComplete: () => {
                if (config.onComplete) config.onComplete(this.card);
            },
            delay: config.delay || 0,
            duration: config.duration || 100,
        });
    }

}