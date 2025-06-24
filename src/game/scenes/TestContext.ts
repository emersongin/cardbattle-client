import { Card } from '@/game/ui/Card';
import { CardContainer } from '@ui/CardContainer';
import { VueScene } from './VueScene';

export class TestContext extends VueScene
{
    constructor () {
        super('TestContext');
    }

    preload () {
        this.load.image('card-picture', 'assets/card-picture.png');
    }

    create ()
    {
        const children = [
            Card.create(this, 0, 0, 0xff0000),
        ];
        CardContainer.create(this, 100, 100, 300, 150, children);
    }
}
