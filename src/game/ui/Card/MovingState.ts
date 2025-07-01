import { Card } from "./Card";
import { CardState, StaticState } from "./CardState";
import { Move } from "./Move";

export default class MovingState implements CardState {
    #movesArray: Move[][] = [];
    #tweens: Phaser.Tweens.TweenChain[] = [];
    
    constructor(readonly card: Card) {}

    create() {
        // This method is called when the state is created.
    }

    addTweens(moves: Move[], duration: number = 0) {
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

    movePosition(xTo: number, yTo: number, duration: number = 0) {
        const moves: Move[] = [
            MovingState.createMove(xTo, yTo, duration)
        ];
        this.addTweens(moves, duration);
    }

    static createMove(x: number, y: number, duration: number = 0): Move {
        return { x, y, duration, hold: 0 };
    }

    moveFromTo(xFrom: number, yFrom: number, xTo: number, yTo: number, duration: number) {
        const moves: Move[] = [
            MovingState.createMove(xFrom, yFrom),
            MovingState.createMove(xTo, yTo, duration)
        ];
        this.addTweens(moves, duration);
    }

    close(onCanStart?: () => boolean, onClosed?: () => void): void {
        const moves: Move[] = [
            {
                x: this.card.x + (this.card.width / 2),
                scaleX: 0,
                ease: 'Linear',
                canStart: () => {
                    return this.card.isOpened() && (!onCanStart || onCanStart());
                },
                onComplete: () => {
                    this.card.closed = true;
                    if (onClosed) onClosed();
                }, 
            },
        ];
        this.addTweens(moves, 200);
    }

    open(onCanStart?: () => boolean, onOpened?: () => void): void {
        const moves: Move[] = [
            {
                x: this.card.x,
                scaleX: 1,
                ease: 'Linear',
                canStart: () => {
                    return this.card.closed && (!onCanStart || onCanStart());
                },
                onComplete: () => {
                    this.card.closed = false;
                    if (onOpened) onOpened();
                }, 
            }
        ];
        this.addTweens(moves, 200);
    }
}
