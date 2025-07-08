// import { Cardset } from '@/game/ui/Cardset/Cardset';
import { CardData } from '@/game/ui/CardData';
import { VueScene } from './VueScene';
import { Cardset } from '../ui/Cardset/Cardset';
import { ColorsPoints } from '../ui/ColorsPoints';
import { CardColors, CardType, CARD_WIDTH, CARD_HEIGHT } from '../ui/Card/Card';
import { CommandWindow } from '../ui/CommandWindow';

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
                color: 'blue' as CardColors,
                imageName: 'card-picture',
                hp: 10,
                ap: 5,
                typeId: 'battle' as CardType,
                powerId: 'none',
                cost: 1
            },
            {
                UUID: '123e4567-e89b-12d3-a456-426614174444',
                number: 1,
                name: 'Test Power Card',
                description: 'This is a test power card description.',
                color: 'red' as CardColors,
                imageName: 'card-picture',
                hp: 0,
                ap: 0,
                typeId: 'power' as CardType,
                powerId: 'power-1',
                cost: 1
            },
        ];
        const cardsData: CardData[] = this.duplicate(cards, 20); // 40
        const dimensions = { 
            x: this.cameras.main.centerX / 2, 
            y: this.cameras.main.centerY - 75, 
            width: (CARD_WIDTH * 6), 
            height: CARD_HEIGHT 
        };
        const cardset = new Cardset(this, dimensions, cardsData);
        const events = {
            onChangeIndex: (cardIndex: number) => {
                if (!cardset.isValidIndex(cardIndex)) return;
                // console.log(cardset.getCardByIndex(cardIndex).getName());
            },
            onMarked: (cardIndex: number) => {
                if (!cardset.isValidIndex(cardIndex)) return;
                // console.log(cardset.getCardByIndex(cardIndex).getName());
            },
            onCompleted: (cardIndexes: number[]) => {
                cardset.highlightCardsByIndexes(cardIndexes);
                const commandWindow = CommandWindow.createBottom(this, 'Complete your choice?', [
                    {
                        description: 'Yes',
                        onSelect: () => {
                            console.log('Selected cards:', cardIndexes);
                        }
                    },
                    {
                        description: 'No',
                        onSelect: () => {
                            cardset.restoreSelectState();
                        }
                    },
                ]);
                commandWindow.open();
            },
            onLeave: () => {
                cardset.resetCardsState();
                cardset.closeAllCardsDomino();
            },
        };
        const colorPoints: ColorsPoints = {
            red: cardsData.filter(card => card.color === 'red').length,
            blue: cardsData.filter(card => card.color === 'blue').length,
            green: 0,
            black: 0,
            white: 0,
            orange: 0
        };
        // cardset.selectModeOne(events);
        cardset.selectModeMany(events, colorPoints);
        // cardset.closeAllCards();
        // cardset.closeAllCardsDomino();
        // cardset.disablePowerCards();
        // cardset.disableBattleCards();
        // const card = new Card(this, cardsData[0]);
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
