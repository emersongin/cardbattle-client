import { Card } from "./Card";
import { CardState, StaticState } from "./CardState";
import { Move } from "./Move";

export default class MovingState implements CardState {
    #moves: Move[][] = [];
    #tweens: Phaser.Tweens.TweenChain[] = [];
    constructor(
        readonly card: Card, 
        moves: Move[],
        duration: number = 300,
    ) {
        this.addMoves(moves, duration);
    }

    create() {
        // This method is called when the state is created.
    }

    addMoves(moves: Move[], duration: number) {
        const movesConfig = moves.map(move => {
            return {
                hold: 0,
                duration,
                ...move,
            };
        });
        this.#moves.push(movesConfig);
    }

    update() {
        if (this.isPlaying()) return;
        if (this.hasMoves()) this.createTweens();
        if (this.hasTweens()) return;
        this.stopped();
    }

    createTweens() {
        const moves = this.#moves.shift();
        const tweens = this.card.scene.tweens.chain({ 
            targets: this.card, 
            tweens: moves,
            onComplete: () => {
                this.#tweens = this.#tweens.filter(t => t !== tweens);
            } 
        });
        this.#tweens.push(tweens);
    }

    hasMoves(): boolean {
        return this.#moves.length > 0;
    }

    hasTweens(): boolean {
        return this.#tweens.length > 0;
    }

    isPlaying(): boolean {
        return this.#tweens.some(tween => tween.isPlaying()) ?? false;
    }

    stopped() {
        this.card.changeState(new StaticState(this.card));
    }
}