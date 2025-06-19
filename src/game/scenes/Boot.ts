import { EventBus } from '@game/EventBus';
import { VueScene } from './VueScene';

export class Boot extends VueScene
{
    constructor ()
    {
        super('Boot');
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }

    update(): void {
        // throw new Error('Method not implemented.');
    }

    destroy(): void {
        // throw new Error('Method not implemented.');
    }
}
