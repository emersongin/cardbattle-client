import { Card } from "./Card";
import { CardState, StaticState } from "./CardState";
import { Move } from "./Move";

export default class MovingState implements CardState {
    #movesArray: Move[][] = [];
    #tweens: Phaser.Tweens.TweenChain[] = [];
    
    constructor(readonly card: Card) {}

    create(moves: Move[], duration: number | null = null) {
        this.addTweens(moves, duration);
    }

    addTweens(moves: Move[], duration: number | null = null) {
        const moveTweens = moves.map(move => {
            move = { ...move, hold: 0 };
            if (duration) {
                move.duration = duration;
            }
            return move;
        });
        this.pushMoves(moveTweens);
    }
    
    pushMoves(moves: Move[]) {
        this.#movesArray.push(moves);
    }

    preUpdate() {
        if (this.isPlaying()) return;
        if (this.hasMoves()) this.createTweens();
        if (this.hasTweens()) return;
        this.static();
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

    static() {
        this.card.changeState(new StaticState(this.card));
    }

    moving() {
        throw new Error('MovingState: cannot call moving() from MovingState.');
    }

    updating() {
        throw new Error('MovingState: cannot call updating() from MovingState.');
    }

    static createPositionMove(xTo: number, yTo: number, duration: number = 0): Move[] {
        const moves: Move[] = [
            MovingState.createMove(xTo, yTo, duration)
        ];
        return moves;
    }

    static createMove(x: number, y: number, duration: number = 0): Move {
        return { x, y, duration, hold: 0 };
    }

    static createFromToMove(xFrom: number, yFrom: number, xTo: number, yTo: number, duration: number): Move[] {
        const moves: Move[] = [
            MovingState.createMove(xFrom, yFrom),
            MovingState.createMove(xTo, yTo, duration)
        ];
        return moves;
    }

    static createCloseMove(card: Card, onCanStart?: () => boolean, onClosed?: () => void, delay: number = 0): Move[] {
        const moves: Move[] = [
            {
                x: card.x + (card.width / 2),
                scaleX: 0,
                ease: 'Linear',
                canStart: () => {
                    return card.isOpened() && (!onCanStart || onCanStart());
                },
                onComplete: onClosed,
                delay
            },
        ];
        return moves;
    }

    static createOpenMove(card: Card, onCanStart?: () => boolean, onOpened?: () => void, delay: number = 0): Move[] {
        const moves: Move[] = [
            {
                x: card.x,
                scaleX: 1,
                ease: 'Linear',
                canStart: () => {
                    return card.isClosed() && (!onCanStart || onCanStart());
                },
                onComplete: onOpened, 
                delay
            }
        ];
        return moves;
    }
}
