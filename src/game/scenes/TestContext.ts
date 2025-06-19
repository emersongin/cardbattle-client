import { Scene } from 'phaser';
import { CardUi } from '../ui/CardUi';
import { CardContainer } from '../ui/CardContainer';

export class TestContext extends Scene
{
    constructor ()
    {
        super('TestContext');
    }

    preload ()
    {
        console.log('TestContext Preload');
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
}
