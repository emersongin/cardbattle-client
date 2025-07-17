import { Card } from "../Card";
import { CardState } from "./CardState";
import StaticState from "./StaticState";

export default class FlashState implements CardState {
    #flashLayer: Phaser.GameObjects.Rectangle;
    
    constructor(readonly card: Card) {}

    create(color: number, delay?: number, duration?: number): void {
        this.#createFlashLayer(color);
        this.#flash(delay, duration);
    }

    #createFlashLayer(color: number = 0xffffff): void {
        const flashLayer = this.card.scene.add.rectangle(0, 0, this.card.getWidth(), this.card.getHeight(), color, 1);
        flashLayer.setOrigin(0, 0);
        flashLayer.setVisible(false);
        this.#flashLayer = flashLayer;
        this.card.getUi().add(this.#flashLayer);
    }

    #flash(delay: number = 100, duration: number = 600): void {
        this.card.scene.tweens.add({
            targets: this.#flashLayer,
            alpha: 0,
            delay,
            duration,
            ease: 'Power2',
            onStart: () => {
                this.#flashLayer.setVisible(true);
            },
            onComplete: () => {
                this.#flashLayer.alpha = 1;
                this.#flashLayer.setVisible(false);
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