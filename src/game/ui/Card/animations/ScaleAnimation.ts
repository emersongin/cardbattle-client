
import { Card } from "@ui/Card/Card";
import { ScaleConfig } from "@ui/Card/animations/types/ScaleConfig";

export class ScaleAnimation {

    constructor(readonly card: Card, config: ScaleConfig) {
        if (config.open) {
            this.card.scene.tweens.add({ 
                targets: this.card.getUi().getMainLayer(), 
                x: this.card.getOriginX(),
                scaleX: 1,
                ease: 'Linear',
                onComplete: () => {
                    this.card.setOpened();
                    if (config?.onComplete) config.onComplete();
                },
                delay: config?.delay || 0,
                duration: config?.duration || 100,
            });
            return;
        }
        this.card.scene.tweens.add({ 
            targets: this.card.getUi().getMainLayer(), 
            x: this.card.getX() + (this.card.getWidth() / 2),
            scaleX: 0,
            ease: 'Linear',
            onComplete: () => {
                this.card.setClosed();
                if (config?.destroy) this.card.destroy();
                if (config?.onComplete) config.onComplete();
            },
            delay: config?.delay || 0,
            duration: config?.duration || 100,
        });
    }

}