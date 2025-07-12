import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { CardBattle } from '../api/CardBattle';

export class VueScene extends Scene {
    #api: CardBattle;

    constructor (name: string) {
        super(name);
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    async setCardBattle(api: CardBattle): Promise<void> {
        this.#api = api;
        // console.log(await this.#api.getChallenges(this.randomInt(1000, 3000)));
        // console.log(`API set in scene: ${this.scene.key}`);
    }

    getCardBattle(): CardBattle {
        if (!this.#api) {
            throw new Error('API not set in scene');
        }
        return this.#api;
    }
}