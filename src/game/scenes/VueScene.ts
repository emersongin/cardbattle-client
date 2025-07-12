import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { CardBattleApi } from '../api/CardBattleApi';

export class VueScene extends Scene {
    #api: CardBattleApi;

    constructor (name: string) {
        super(name);
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    async setApi(api: CardBattleApi): Promise<void> {
        this.#api = api;
        // console.log(await this.#api.getChallenges(this.randomInt(1000, 3000)));
        // console.log(`API set in scene: ${this.scene.key}`);
    }

    getApi(): CardBattleApi {
        if (!this.#api) {
            throw new Error('API not set in scene');
        }
        return this.#api;
    }

    // randomInt(min: number, max: number): number {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }
}