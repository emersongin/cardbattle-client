// import { Cardset } from '@/game/ui/Cardset/Cardset';
import { CardData } from '@/game/ui/Cardset/CardData';
import { VueScene } from './VueScene';
import { Cardset } from '../ui/Cardset/Cardset';
// import { Card } from '@ui/Card/Card';

export class TestContext extends VueScene
{
    constructor () {
        super('TestContext');
    }

    preload () {
        this.load.image('card-picture', 'assets/card-picture.png');
    }

    create () {
        const cards = [
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
        const cardsData: CardData[] = this.duplicate(cards, 20);
        Cardset.createSelectMove(this, { x: 10, y: 10, width: 400, height: 400 }, cardsData, {
            onLeftArrow: () => console.log('Left arrow pressed'),
            onRightArrow: () => console.log('Right arrow pressed'),
            onChoice: () => console.log('Choice made'),
            onSelect: () => console.log('Card selected'),
            onLeave: () => console.log('Cardset left')
        });
        // Cardset.create(this, { x: 10, y: 10, width: 400, height: 400 }, cardsData);
        // const card = Card.create(this, cardsData[0]);
        // card.changeDisplayPoints(99, 99);
        // card.flip();
        // card.turnDown();
        // card.moveFromTo(0, 0, 500, 500, 300);
        // card.movePosition(100, 100);
        // card.disable();
        // card.enable();
        // card.select();
        // card.mark();
        // card.highlight();
    }

    duplicate(cards: CardData[], number: number) {
        const duplicatedCards: CardData[] = [];
        for (let i = 0; i < number; i++) {
            duplicatedCards.push(...cards);
        }
        return duplicatedCards;
    }
}
