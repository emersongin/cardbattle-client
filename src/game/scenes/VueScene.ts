import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { CardBattle } from '@api/CardBattle';
import { TweenConfig } from '@types/TweenConfig';

type VoidCallback = (config?: TweenConfig) => void;
type TimelineTarget = Phaser.GameObjects.Components.Transform | VoidCallback;

export type TimelineEvent<T extends TimelineTarget> = {
    target: T, 
    index: number,
    pause: () => void;
    resume: () => void;
    tween?: Phaser.Tweens.Tween, 
};

export type TimelineConfig<T extends TimelineTarget> = {
    targets: T[];
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

    timeline<T extends TimelineTarget>(timiline: TimelineConfig<T>): void {
        const promises = timiline.targets.map((target: T, index: number) => {
            return new Promise<void>((resolve) => {
                const tweenConfig = { 
                    targets: target,
                    durantion: 0,
                    delay: 0,
                    hold: 0,
                    onStart: (tween: Phaser.Tweens.Tween) => {
                        const pause = () => tween!.pause();
                        const resume = () => {
                            tween!.resume();
                            resolve();
                        };
                        if (timiline.onStart) {
                            timiline.onStart({ target, index, pause, resume, tween } as TimelineEvent<T>);
                            return;
                        }
                        pause();
                        if (typeof target === 'function') {
                            target({ onComplete: resume });
                            return;
                        }
                        resume();
                    },
                    onComplete: (tween: Phaser.Tweens.Tween) => {
                        if (timiline.onComplete) {
                            timiline.onComplete(target, tween, index);
                            resolve();
                        };
                    },
                };
                this.tweens.add(tweenConfig);
            });
        });
        Promise.all(promises).then(() => {
            if (timiline.onAllComplete) timiline.onAllComplete();
        });
    }
}