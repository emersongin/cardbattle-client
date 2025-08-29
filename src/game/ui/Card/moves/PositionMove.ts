
import { Card } from "../Card";
import { PositionCardConfig } from "./types/PositionCardConfig";

export class PositionMove {

    constructor(readonly card: Card, config: PositionCardConfig) {
        this.card.scene.tweens.chain({ 
            targets: this.card.getUi(), 
            tweens: [
                { 
                    x: config.xFrom || this.card.getX() || 0, 
                    y: config.yFrom || this.card.getY() || 0, 
                    delay: 0,
                    duration: 0 
                },
                {
                    x: config.xTo, 
                    y: config.yTo,
                    delay: config.delay,
                    duration: config.duration,
                    onStart: config.onStart,
                    onComplete: () => {
                        if (config.onComplete) config.onComplete();
                        this.card.updateOrigin(this.card.getX(), this.card.getY());
                    }
                }
            ],
        });
    }

}