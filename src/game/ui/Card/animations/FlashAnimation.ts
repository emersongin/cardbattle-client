import { Card } from "../Card";
import { FlashCardConfig } from "./types/FlashCardConfig";


export class FlashAnimation {
    #flashLayer: Phaser.GameObjects.Rectangle;
    
    constructor(readonly card: Card, config?: FlashCardConfig) {
        this.#createFlashLayer(config?.color || 0xffffff);
        this.card.scene.tweens.add({
            targets: this.#flashLayer,
            alpha: 0,
            delay: config?.delay || 100,
            duration: config?.duration || 600,
            ease: 'Power2',
            onStart: () => {
                this.#flashLayer.setVisible(true);
                if (config?.onStart) config.onStart(this.card);
            },
            onComplete: () => {
                this.#flashLayer.alpha = 1;
                this.#flashLayer.setVisible(false);
                if (config?.onComplete) config.onComplete(this.card);
            }
        });
    }

    #createFlashLayer(color: number = 0xffffff): void {
        const flashLayer = this.card.scene.add.rectangle(0, 0, this.card.getWidth(), this.card.getHeight(), color, 1);
        flashLayer.setOrigin(0, 0);
        flashLayer.setVisible(false);
        this.#flashLayer = flashLayer;
        this.card.getUi().add(this.#flashLayer);
    }
}