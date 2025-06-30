import { UpdatePoints } from "./UpdatePoints";
import { CardState, StaticState } from "./CardState";
import { Card } from "./Card";

export default class UpdatingState implements CardState {
    #updates: UpdatePoints[][] = [];
    #tweens: Phaser.Tweens.Tween[][] = [];
    
    constructor(readonly card: Card) {}

    create(updatePoints: UpdatePoints[], duration: number) {
        this.addTweens(updatePoints, duration);
    }

    addTweens(moves: UpdatePoints[], duration: number) {
        const updateTweens = moves.map(move => {
            return {
                hold: 0,
                duration,
                ...move,
            };
        });
        this.pushMoves(updateTweens);
    }
    
    pushMoves(moves: UpdatePoints[]) {
        this.#updates.push(moves);
    }

    update() {
        if (this.isPlaying()) return;
        if (this.hasUpdates()) this.createTweens();
        if (this.hasTweens()) return;
        this.stopped();
    }

    isPlaying(): boolean {
        return this.#tweens.some(group  => group.some(tween => tween.isPlaying())) ?? false;
    }

    hasUpdates(): boolean {
        return this.#updates.length > 0;
    }

    createTweens() {
        const updates = this.#updates.shift();
        if (!updates || updates.length === 0) return;
        let counterTweens = [];
        for (const points of updates) {
            const tween = this.card.scene.tweens.addCounter({
                ...points,
                onComplete: () => {
                    for (let index = 0; index < this.#tweens.length; index++) {
                        const group = this.#tweens[index];
                        const filteredGroup = group.filter(t => t !== tween);
                        this.#tweens[index] = filteredGroup;
                    }
                } 
            });
            counterTweens.push(tween);
        }
        this.#tweens.push(counterTweens);
    }

    hasTweens(): boolean {
        return this.#tweens.length > 0;
    }

    stopped() {
        this.card.changeState(new StaticState(this.card));
    }
}