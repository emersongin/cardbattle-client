
import { Card } from "../Card";
import { OpenCloseCardConfig } from "./types/OpenCloseCardConfig";

export class OpenCloseMove {

    constructor(readonly card: Card, config: OpenCloseCardConfig) {
        // this.card.updateOrigin();
        if (config?.open) {
            this.card.scene.tweens.add({ 
                targets: this.card.getUi(), 
                x: card.getOriginX(),
                scaleX: 1,
                ease: 'Linear',
                canStart: () => {
                    return card.isClosed() && (!config.onCanStart || config.onCanStart());
                },
                onComplete: () => {
                    if (config.onComplete) config.onComplete(this.card);
                },
                delay: config.delay || 100,
                duration: config.duration,
            });
            return;
        }
        this.card.scene.tweens.add({ 
            targets: this.card.getUi(), 
            x: card.getX() + (card.getWidth() / 2),
            scaleX: 0,
            ease: 'Linear',
            canStart: () => {
                return card.isOpened() && (!config.onCanStart || config.onCanStart());
            },
            onComplete: () => {
                if (config.onComplete) config.onComplete(this.card);
            },
            delay: config.delay || 0,
            duration: config.duration || 100,
        });
    }

}