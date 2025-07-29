import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { CardBattle } from '../api/CardBattle';

export type TimelineEvent<T extends Phaser.GameObjects.Components.Transform> = {
    target: T, 
    tween?: Phaser.Tweens.Tween, 
    index?: number, 
    x?: number, 
    y?: number,
    delay?: number, 
    duration?: number
};

export type TimelineConfig<T extends Phaser.GameObjects.Components.Transform> = {
    targets: T[];
    delay?: number;
    eachDelay?: number;
    durantion?: number;
    eachDuration?: number;
    x?: number;
    eachX?: number;
    y?: number;
    eachY?: number;
    onStart?: (event: TimelineEvent<T>) => void;
    onComplete?: (target: T, tween: Phaser.Tweens.Tween, index: number) => void;
    onAllComplete?: () => void;
}

export class VueScene extends Scene {
    #cardBattle: CardBattle;

    constructor (name: string) {
        super(name);
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    async setCardBattle(cardBattle: CardBattle): Promise<void> {
        this.#cardBattle = cardBattle;
    }

    getCardBattle(): CardBattle {
        if (!this.#cardBattle) {
            throw new Error('API not set in scene');
        }
        return this.#cardBattle;
    }

    timeline<T extends Phaser.GameObjects.Components.Transform>(timiline: TimelineConfig<T>): void {
        const promises = timiline.targets.map((target: T, index: number) => {
            return new Promise<void>((resolve) => {
                const tweenConfig = { 
                    targets: target,
                    durantion: 0,
                    delay: 0,
                    hold: 0,
                    onStart: (tween: Phaser.Tweens.Tween) => {
                        if (timiline.onStart) timiline.onStart({
                            target, 
                            tween, 
                            index
                        });
                    },
                    onComplete: (tween: Phaser.Tweens.Tween) => {
                        if (timiline.onComplete) timiline.onComplete(target, tween, index);
                        resolve();
                    },
                };
                this.tweens.add(tweenConfig);
            });
        });
        Promise.all(promises).then(() => {
            timiline.onAllComplete?.();
        });
    }
}