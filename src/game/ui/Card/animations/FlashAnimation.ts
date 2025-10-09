import { Card } from "@ui/Card/Card";
import { FlashConfig } from "@ui/Card/animations/types/FlashConfig";

export class FlashAnimation {
    #flashLayer: Phaser.GameObjects.Rectangle;
    
    constructor(readonly card: Card, config: FlashConfig) {
        this.card.scene.tweens.add({
            targets: this.#createFlashLayer(config.color || 0xffffff),
            alpha: 0,
            delay: config?.delay || 100,
            duration: config?.duration || 600,
            ease: 'Power2',
            onStart: () => {
                this.#flashLayer.setVisible(true);
                if (config?.onStart) config.onStart();
            },
            onComplete: () => {
                this.#flashLayer.alpha = 1;
                this.#flashLayer.setVisible(false);
                if (config?.onComplete) config.onComplete();
            }
        });
    }

    #createFlashLayer(color: number = 0xffffff): Phaser.GameObjects.Rectangle {
        const flashLayer = this.card.scene.add.rectangle(0, 0, this.card.getWidth(), this.card.getHeight(), color, 1);
        flashLayer.setOrigin(0, 0);
        flashLayer.setVisible(false);
        this.#flashLayer = flashLayer;
        this.card.getUi().add(this.#flashLayer);
        return this.#flashLayer;
    }
}