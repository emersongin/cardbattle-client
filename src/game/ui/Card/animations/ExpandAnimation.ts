
import { Card } from "../Card";
import { ExpandConfig } from "./types/ExpandConfig";

export class ExpandAnimation {

    constructor(readonly card: Card, config?: ExpandConfig) {
        this.card.scene.tweens.add({
            targets: this.card.getUi(),
            x: card.getOriginX() - (card.getWidth() * 0.25),
            y: card.getOriginY() - (card.getHeight() * 0.25),
            scaleX: 1.5,
            scaleY: 1.5,
            ease: 'Linear',
            delay: config?.delay || 200,
            duration: config?.duration || 200,
            onComplete: () => {
                if (config?.onComplete) config.onComplete();
            },
        });
    }

}