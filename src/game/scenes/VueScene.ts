import { Scene } from 'phaser';

export class VueScene extends Scene {
    #api: any = null;

    constructor (name: string) {
        super(name);
    }

    setApi(api: any): void {
        this.#api = api;
        this.#api.execute();
        console.log(`API set in scene: ${this.scene.key}`);
    }
}