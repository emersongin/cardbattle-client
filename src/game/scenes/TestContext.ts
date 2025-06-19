import { CardUi } from '@ui/CardUi';
import { CardContainer } from '@ui/CardContainer';
import { EventBus } from '@game/EventBus';
import { VueScene } from './VueScene';

export class TestContext extends VueScene
{
    constructor () {
        super('TestContext');
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    preload () {

    }

    create ()
    {
        const children = [
            CardUi.create(this, 0, 0, 0xff0000),
            CardUi.create(this, 0, 0, 0x00ff00),
            CardUi.create(this, 0, 0, 0x0000ff),
            CardUi.create(this, 0, 0, 0xff00ff),
            CardUi.create(this, 0, 0, 0x00ffff),
            CardUi.create(this, 0, 0, 0xffff00),
        ];
        CardContainer.create(this, 100, 100, 300, 150, children);
    }

    update(): void {
        // throw new Error('Method not implemented.');
    }

    destroy(): void {
        // throw new Error('Method not implemented.');
    }
}
