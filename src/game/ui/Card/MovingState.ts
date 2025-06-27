import { Card } from "./Card";
import { CardState, StaticState } from "./CardState";
import { Move } from "./Move";

export default class MovingState implements CardState {
    #movesTweens: Phaser.Tweens.TweenChain | undefined;
    constructor(
        readonly card: Card, 
        readonly moves: Move[],
        readonly duration: number = 300,
    ) {}

    create() {
        const tweens = this.moves.map(move => {
            return {
                hold: 0,
                duration: this.duration,
                ...move,
            };
        });
        this.#movesTweens = this.card.scene.tweens.chain({ targets: this.card, tweens });
    }

    isPlaying(): boolean {
        return this.#movesTweens?.isPlaying() ?? false;
    }

    update() {
        if (this.isPlaying()) return;
        this.stopped();
    }

    stopped() {
        this.card.changeState(new StaticState(this.card));
    }
}