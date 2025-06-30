import { Card } from "./Card";
import { CardState, StaticState } from "./CardState";
import { Move } from "./Move";

export default class MovingState implements CardState {
    #movesArray: Move[][] = [];
    #tweens: Phaser.Tweens.TweenChain[] = [];
    
    constructor(readonly card: Card) {}

    create(moves: Move[], duration: number) {
        this.addTweens(moves, duration);
    }

    addTweens(moves: Move[], duration: number) {
        const moveTweens = moves.map(move => {
            return {
                ...move,
                hold: 0,
                duration,
            };
        });
        this.pushMoves(moveTweens);
    }
    
    pushMoves(moves: Move[]) {
        this.#movesArray.push(moves);
    }

    update() {
        if (this.isPlaying()) return;
        if (this.hasMoves()) this.createTweens();
        if (this.hasTweens()) return;
        this.stopped();
    }

    isPlaying(): boolean {
        return this.#tweens.some(tween => tween.isPlaying()) ?? false;
    }

    hasMoves(): boolean {
        return this.#movesArray.length > 0;
    }

    createTweens() {
        const moves = this.#movesArray.shift()!.filter((m: Move) => m.canStart ? m.canStart() : true);
        if (!moves || moves.length === 0) return;
        const tweens = this.card.scene.tweens.chain({ 
            targets: this.card, 
            tweens: moves,
            onComplete: () => {
                this.#tweens = this.#tweens.filter(t => t !== tweens);
            } 
        });
        this.#tweens.push(tweens);
    }

    hasTweens(): boolean {
        return this.hasMoves() || this.#tweens.length > 0;
    }

    stopped() {
        this.card.changeState(new StaticState(this.card));
    }
}
