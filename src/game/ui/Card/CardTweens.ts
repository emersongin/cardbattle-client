import { Card } from "./Card";
import { CardState, StaticState } from "./CardState";

export default abstract class CardTweens<CardTween> implements CardState {
    #cardTweens: CardTween[][] = [];
    #actionTweens: Phaser.Tweens.TweenChain[] = [];
    
    constructor(readonly card: Card) {}

    abstract addTweens(cardTweens: CardTween[], duration: number): void;

    create(..._args: any[]): void {
        // This method is called when the state is created.
    }
    
    pushCardTweens(cardTweens: CardTween[]) {
        this.#cardTweens.push(cardTweens);
    }

    update() {
        if (this.isPlaying()) return;
        if (this.hasCardTweens()) this.createActionTweens();
        if (this.hasTweens()) return;
        this.stopped();
    }

    createActionTweens() {
        const cardTweens = this.#cardTweens.shift();
        if (!cardTweens || cardTweens.length === 0) return;
        for (const points of cardTweens) {
            if (points instanceof Phaser.Tweens.Tween) {
                console.log(points);
                this.card.scene.tweens.addCounter(points);
            }
        }
        return;
        const tweens = this.card.scene.tweens.chain({ 
            targets: this.card, 
            tweens: cardTweens,
            onComplete: () => {
                this.#actionTweens = this.#actionTweens.filter(t => t !== tweens);
            } 
        });
        this.#actionTweens.push(tweens);
    }

    hasCardTweens(): boolean {
        return this.#cardTweens.length > 0;
    }

    hasTweens(): boolean {
        return this.#actionTweens.length > 0;
    }

    isPlaying(): boolean {
        return this.#actionTweens.some(tween => tween.isPlaying()) ?? false;
    }

    stopped() {
        this.card.changeState(new StaticState(this.card));
    }
}