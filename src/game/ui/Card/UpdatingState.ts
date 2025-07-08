import { UpdatePoints } from "./UpdatePoints";
import { CardState, StaticState } from "./CardState";
import { Card } from "./Card";
import { CardPoints } from "./CardPoints";

export default class UpdatingState implements CardState {
    #updates: UpdatePoints[][] = [];
    #tweens: Phaser.Tweens.Tween[][] = [];
    
    constructor(readonly card: Card) {}

    create(ap: number, hp: number, duration: number) {
        this.addTweens(ap, hp, duration);
    }

    addTweens(ap: number, hp: number, duration: number) {
        const fromTarget = this.card.getAllData('ap', 'hp');
        const toTarget = { ap, hp };
        const updates = this.createUpdatePoints(fromTarget, toTarget);
        const updateTweens = updates.map(update => {
            return {
                ...update,
                hold: 0,
                duration,
            };
        });
        this.pushUpdates(updateTweens);
    }

    private createUpdatePoints(fromTarget: CardPoints, toTarget: CardPoints): UpdatePoints[] {
        const apPoints = this.createUpdate(fromTarget, fromTarget.ap, toTarget.ap,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.ap = Math.round(tween.getValue() ?? 0);
                const apText = Math.round(fromTarget.ap).toString().padStart(2, "0");
                const hpText = Math.round(fromTarget.hp).toString().padStart(2, "0");
                this.card.setDisplayText(`${apText}/${hpText}`);
            },
            () => this.card.setData('ap', toTarget.ap)
        );
        const hpPoints = this.createUpdate(fromTarget, fromTarget.hp, toTarget.hp,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.hp = Math.round(tween.getValue() ?? 0);
                const apText = Math.round(fromTarget.ap).toString().padStart(2, "0");
                const hpText = Math.round(fromTarget.hp).toString().padStart(2, "0");
                this.card.setDisplayText(`${apText}/${hpText}`);
            },
            () => this.card.setData('hp', toTarget.hp)
        );
        return [apPoints, hpPoints];
    }

    private createUpdate(
        target: CardPoints,
        fromPoints: number, 
        toPoints: number, 
        onUpdate: (tween: Phaser.Tweens.Tween) => void,
        onComplete: () => void,
    ): UpdatePoints {
        return {
            target,
            from: fromPoints,
            to: toPoints,
            duration: 300,
            ease: 'linear',
            onUpdate,
            onComplete
        };
    }
    
    pushUpdates(updates: UpdatePoints[]) {
        this.#updates.push(updates);
    }

    preUpdate() {
        if (this.isPlaying()) return;
        if (this.hasUpdates()) this.createTweens();
        if (this.hasTweens()) return;
        this.static();
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
        return this.hasUpdates() || this.#tweens.length > 0;
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
}