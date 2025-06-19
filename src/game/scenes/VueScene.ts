import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';

export type Api = {
    execute: () => void;
}

export class VueScene extends Scene {
    #api: any = null;

    constructor (name: string) {
        super(name);
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    setApi(api: Api): void {
        this.#api = api;
        this.#api.execute();
        console.log(`API set in scene: ${this.scene.key}`);
    }
}