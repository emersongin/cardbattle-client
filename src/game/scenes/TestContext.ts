// import { Cardset } from '@/game/ui/Cardset/Cardset';
import { CardData } from '@/game/ui/Cardset/CardData';
import { VueScene } from './VueScene';
import { Card } from '@ui/Card/Card';

export class TestContext extends VueScene
{
    constructor () {
        super('TestContext');
    }

    preload () {
        this.load.image('card-picture', 'assets/card-picture.png');
    }

    create () {
        const cardsData: CardData[] = [
            {
                UUID: '123e4567-e89b-12d3-a456-426614174000',
                number: 1,
                name: 'Test Card',
                description: 'This is a test card description.',
                color: 'blue',
                imageName: 'card-picture',
                hp: 10,
                ap: 5,
                typeId: 'battle',
                powerId: 'none'
            },
            {
                UUID: '123e4567-e89b-12d3-a456-426614174444',
                number: 1,
                name: 'Test Power Card',
                description: 'This is a test power card description.',
                color: 'red',
                imageName: 'card-picture',
                hp: 0,
                ap: 0,
                typeId: 'power',
                powerId: 'power-1'
            },
        ];
        // Cardset.create(this, { x: 10, y: 10, width: 400, height: 400 }, cardsData, {});
        const card = Card.create(this, cardsData[0]);
        // card.close();
        // card.open();
        card.flip();
        // card.moveFromTo(0, 0, 500, 500, 300);
        // card.movePosition(100, 100);
    }
}
