import { CardPoints } from "./CardPoints";
import { CardState } from "./CardState";
import CardTweens from "./CardTweens";

export default class UpdatingState extends CardTweens<CardPoints> implements CardState {
    #cardPoints: { ap: number; hp: number };

    create(ap: number, hp: number) {
        this.#cardPoints = {
            ap: this.card.getData('ap') ?? 0,
            hp: this.card.getData('hp') ?? 0,
        };
        const apPoints: CardPoints = {
            target: this.#cardPoints,
            from: this.#cardPoints.ap,
            to: ap,
            duration: 1000,
            ease: 'linear',
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                const apText = Math.round(tween.getValue() ?? 0).toString().padStart(2, "0");
                const hpText = hp.toString().padStart(2, "0");
                this.card.display.setText(`${apText}/${hpText}`);
            }
        };
        const hpPoints: CardPoints = {
            target: this.#cardPoints,
            from: this.#cardPoints.hp,
            to: hp,
            duration: 1000,
            ease: 'linear',
            onUpdate: (tween: Phaser.Tweens.Tween) => {
                const apText = Math.round(this.card.getData('ap')).toString().padStart(2, "0");
                const hpText = Math.round(tween.getValue() ?? 0).toString().padStart(2, "0");
                this.card.display.setText(`${apText}/${hpText}`);
            }
        };
        this.addTweens([apPoints, hpPoints], 300);
    }

    addTweens(cardPoints: CardPoints[], duration: number) {
        const cardTweens = cardPoints.map(points => {
            return {
                hold: 0,
                duration,
                ...points,
            };
        });
        this.pushCardTweens(cardTweens);
    }

}