import { Scene } from 'phaser';
import { EventBus } from '@game/EventBus';
import { Challenging, Folder } from '../api/main';

export type Api = {
    getChallenges: (timeout?: number) => Promise<Challenging>;
    getFolders: (timeout?: number) => Promise<Folder[]>;
    setFolder: (folderId: string, timeout?: number) => Promise<string>;
    iGo: (timeout?: number) => Promise<boolean>;
}

export class VueScene extends Scene {
    #api: Api;

    constructor (name: string) {
        super(name);
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    async setApi(api: Api): Promise<void> {
        this.#api = api;
        // console.log(await this.#api.getChallenges(this.randomInt(1000, 3000)));
        // console.log(`API set in scene: ${this.scene.key}`);
    }

    getApi(): Api {
        if (!this.#api) {
            throw new Error('API not set in scene');
        }
        return this.#api;
    }

    // randomInt(min: number, max: number): number {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }
}