import { Card } from "../Card";
import { CardState } from "./CardState";
import StaticState from "./StaticState";

export type FlashConfig = {
    color?: number,
    delay?: number,
    duration?: number,
    onStart?: (card: Card) => void,
    onComplete?: (card: Card) => void
};

export default class FlashState implements CardState {
    #flashLayer: Phaser.GameObjects.Rectangle;
    
    constructor(readonly card: Card) {}

    create(config: FlashConfig): void {
        const { color, delay, duration, onStart, onComplete } = config;
        this.#createFlashLayer(color);
        this.#flash(delay, duration, onStart, onComplete);
    }

    #createFlashLayer(color: number = 0xffffff): void {
        const flashLayer = this.card.scene.add.rectangle(0, 0, this.card.getWidth(), this.card.getHeight(), color, 1);
        flashLayer.setOrigin(0, 0);
        flashLayer.setVisible(false);
        this.#flashLayer = flashLayer;
        this.card.getUi().add(this.#flashLayer);
    }

    #flash(delay: number = 100, duration: number = 600, onStart?: (card: Card) => void, onComplete?: (card: Card) => void): void {
        this.card.scene.tweens.add({
            targets: this.#flashLayer,
            alpha: 0,
            delay,
            duration,
            ease: 'Power2',
            onStart: () => {
                this.#flashLayer.setVisible(true);
                if (onStart) onStart(this.card);
            },
            onComplete: () => {
                this.#flashLayer.alpha = 1;
                this.#flashLayer.setVisible(false);
                if (onComplete) onComplete(this.card);
                this.static();
            }
        });
    }

    static() {
        this.card.changeState(new StaticState(this.card));
    }

    moving() {
        throw new Error('cannot call moving() from AnimationState.');
    }

    updating() {
        throw new Error('cannot call updating() from AnimationState.');
    }

    flash() {
        throw new Error('cannot call flash() from AnimationState.');
    }
}