import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { CardBattle } from '../api/CardBattle';

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
    onStart?: (target: T, tween: Phaser.Tweens.Tween, index: number) => void;
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
                let delay = 0;
                let duration = 0;
                let x = (target.x || 0);
                let y = (target.y || 0);
                if (timiline.delay !== undefined) delay = timiline.delay;
                if (timiline.durantion !== undefined) duration = timiline.durantion;
                if (timiline.x !== undefined) x = timiline.x;
                if (timiline.x !== undefined) x = timiline.x;
                if (timiline.eachX !== undefined) x += (index * timiline.eachX);
                if (timiline.eachY !== undefined) y += (index * timiline.eachY);
                if (timiline.eachDelay !== undefined) delay += (index * timiline.eachDelay);
                if (timiline.eachDuration !== undefined) duration += ((index + 1) * timiline.eachDuration);
                const tweenConfig = {
                    targets: target,
                    x, y, 
                    delay, 
                    duration, 
                    hold: 100,
                    onStart: (tween: Phaser.Tweens.Tween) => {
                        if (timiline.onStart) timiline.onStart(target, tween, index);
                    },
                    onComplete: (tween: Phaser.Tweens.Tween) => {
                        if (timiline.onComplete) {
                            timiline.onComplete(target, tween, index);
                        }
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