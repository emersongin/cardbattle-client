
import { Card } from "@ui/Card/Card";
import { MoveConfig } from "./types/MoveConfig";

export class MoveAnimation {

    constructor(readonly card: Card, config: MoveConfig) {
        const tweens = [
            { 
                targets: this.card.getUi(),
                x: (config?.fromX || this.card.getX() || 0), 
                y: (config?.fromY || this.card.getY() || 0),
                delay: 0,
                duration: 0 
            },
            {
                targets: this.card.getUi(),
                x: config.toX, 
                y: config.toY,
                scaleX: 1,
                scaleY: 1,
                delay: config?.delay || 0,
                ease: 'Linear',
                duration: config?.duration || 500,
                onStart: config?.onStart,
                onComplete: () => {
                    this.card.setPosition(config.toX, config.toY);
                    if (config.onComplete) config.onComplete();
                }
            }

            // {
            //     targets: this.card.getUi(),
            //     x: config.toX,
            //     duration: 200,
            //     ease: 'Cubic.easeOut', // vai rápido e desacelera no final
            // },
            // {
            //     targets: this.card.getUi(),
            //     x: this.card.getX(),
            //     duration: 600,
            //     ease: 'Cubic.easeIn', // volta suavemente
            // },

        ] as Phaser.Types.Tweens.TweenBuilderConfig[];
        this.card.scene.tweens.chain({ tweens });
    }

}