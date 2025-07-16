import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { CardBattle } from '../api/CardBattle';

export type TimelineConfig = {
    targets: Phaser.GameObjects.Components.Transform[];
    delay?: number;
    eachDelay?: number;
    durantion?: number;
    eachDuration?: number;
    x?: number;
    eachX?: number;
    y?: number;
    eachY?: number;
    onComplete?: () => void;
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

    timeline(
        timiline: TimelineConfig
    ): void {
        const promises = timiline.targets.map((target: Phaser.GameObjects.Components.Transform, index: number) => {
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
                    hold: 0,
                    onComplete: () => {
                        resolve();
                    },
                };
                this.tweens.add(tweenConfig);
            });
        });
        Promise.all(promises).then(() => {
            timiline.onComplete?.();
        });
    }
}