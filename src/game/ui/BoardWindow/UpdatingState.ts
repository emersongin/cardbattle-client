import BoardWindow, { BoardWindowConfig } from "./BoardWindow";
import { UpdatePoints } from "./UpdatePoints";
import { StaticState, WindowState } from "./WindowState";

export default class UpdatingState implements WindowState {
    #updates: UpdatePoints[][] = [];
    #tweens: Phaser.Tweens.Tween[][] = [];
    
    constructor(readonly window: BoardWindow) {}

    create(toTarget: BoardWindowConfig, duration: number) {
        this.addTweens(toTarget, duration);
    }

    addTweens(toTarget: BoardWindowConfig, duration: number) {
        const fromTarget = this.window.getAllData();
        const updates = this.#createUpdatePoints(fromTarget, toTarget);
        const updateTweens = updates.map(update => {
            return {
                ...update,
                hold: 0,
                duration,
            };
        });
        this.#pushUpdates(updateTweens);
    }

    static() {
        this.window.changeState(new StaticState(this.window));
    }

    updating() {
        throw new Error('MovingState: cannot call updating() from MovingState.');
    }

    #createUpdatePoints(fromTarget: BoardWindowConfig, toTarget: BoardWindowConfig): UpdatePoints[] {
        const apPoints = this.#createUpdate(fromTarget, fromTarget.cardPoints.ap, toTarget.cardPoints.ap,
            (tween: Phaser.Tweens.Tween) => {
                fromTarget.cardPoints.ap = Math.round(tween.getValue() ?? 0);
                const content = this.window.createContent(fromTarget);
                this.window.setText(content);
            },
            () => this.window.setAp(toTarget.cardPoints.ap)
        );
        return [apPoints];
    }

    #createUpdate(
        target: BoardWindowConfig,
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
    
    #pushUpdates(updates: UpdatePoints[]) {
        this.#updates.push(updates);
    }

    preUpdate() {
        if (this.#isPlaying()) return;
        if (this.#hasUpdates()) this.#createTweens();
        if (this.#hasTweens()) return;
        this.static();
    }

    #isPlaying(): boolean {
        return this.#tweens.some(group  => group.some(tween => tween.isPlaying())) ?? false;
    }

    #hasUpdates(): boolean {
        return this.#updates.length > 0;
    }

    #createTweens() {
        const updates = this.#updates.shift();
        if (!updates || updates.length === 0) return;
        let counterTweens = [];
        for (const points of updates) {
            const tween = this.window.scene.tweens.addCounter({
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

    #hasTweens(): boolean {
        return this.#hasUpdates() || this.#tweens.length > 0;
    }
}