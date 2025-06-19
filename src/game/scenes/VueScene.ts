import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';

export type Api = {
    getChallenges: (timeout: number) => void;
}

export class VueScene extends Scene {
    #api: any = null;

    constructor (name: string) {
        super(name);
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    async setApi(api: Api): Promise<void> {
        this.#api = api;
        console.log(await this.#api.getChallenges(this.randomInt(1000, 3000)));
        console.log(`API set in scene: ${this.scene.key}`);
    }

    randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}