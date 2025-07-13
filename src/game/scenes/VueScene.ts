import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { CardBattle } from '../api/CardBattle';

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
}