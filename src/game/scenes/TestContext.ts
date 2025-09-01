// import { Cardset } from '@game/ui/Cardset/Cardset';
import { VueScene } from './VueScene';
// import { Card } from '../ui/Card/Card';
// import { ColorsPoints } from '../types/ColorsPoints';
// import { CARD_HEIGHT, CARD_WIDTH, CardColors, CardType } from '../ui/Card/Card';
// import { CardPoints } from '../ui/Card/types/CardPoints';
// import BoardWindow from '../ui/BoardWindow/BoardWindow';
import { CardData } from '../types';
// import { CardColors } from '../ui/Card/types/CardColors';
// import { CardType } from '../ui/Card/types/CardType';
// import { Cardset } from '../ui/Cardset/Cardset';
// import { BLUE, RED } from '../constants/colors';
// import { BATTLE, POWER } from '../constants/keys';
// import { Card } from '../ui/Card/Card';
// import { CommandWindow } from '../ui/CommandWindow';

export class TestContext extends VueScene
{
    constructor () {
        super('TestContext');
    }

    preload () {
        this.load.image('card-picture', 'assets/card-picture.png');
    }

    create () {
        // const startPoints = {
        //     ap: 0,
        //     hp: 0,
        //     redPoints: 0,
        //     greenPoints: 0,
        //     bluePoints: 0,
        //     blackPoints: 0,
        //     whitePoints: 0,
        //     orangePoints: 0,
        //     numberOfCardsInHand: 0,
        //     numberOfCardsInDeck: 0,
        //     numberOfWins: 0
        // };
        // const boardWindow = BoardWindow.createBottom(this, startPoints);
        // const boardWindow2 = BoardWindow.createTopReverse(this, startPoints);
        // boardWindow.open();
        // boardWindow2.open();
        // const updatePoints = {
        //     cardPoints: {
        //         ap: 999,
        //         hp: 999
        //     },
        //     colorsPoints: {
        //         red: 99,
        //         blue: 99,
        //         green: 99,
        //         black: 99,
        //         white: 99,
        //         orange: 0
        //     },
        //     numberOfCardsInHand: 99,
        //     numberOfCardsInDeck: 99,
        //     numberOfWins: 9
        // };
        // boardWindow.updating(updatePoints);
        // boardWindow2.updating(updatePoints);
        // boardWindow.close();
        // boardWindow2.close();

        // const cards: CardData[] = [
        //     {
        //         id: '123e4567-e89b-12d3-a456-426614174000',
        //         number: 1,
        //         name: 'Test Card',
        //         description: 'This is a test card description.',
        //         details: 'This is a test card details.',
        //         color: RED as CardColors,
        //         imageName: 'card-picture',
        //         hp: 10,
        //         ap: 5,
        //         typeId: BATTLE as CardType,
        //         powerId: 'none',
        //         cost: 1
        //     },
        //     {
        //         id: '123e4567-e89b-12d3-a456-426614174444',
        //         number: 1,
        //         name: 'Test Power Card',
        //         description: 'This is a test power card description.',
        //         details: 'This is a test card details.',
        //         color: BLUE as CardColors,
        //         imageName: 'card-picture',
        //         hp: 0,
        //         ap: 0,
        //         typeId: POWER as CardType,
        //         powerId: 'power-1',
        //         cost: 1
        //     },
        // ];
        // const cardsData: CardData[] = this.duplicate(cards, 3); // 40
        // const dimensions = { 
        //     x: this.cameras.main.centerX / 2, 
        //     y: this.cameras.main.centerY - 75, 
        // };
        // const cardset = new Cardset(this, cardsData);

        // const events = {
        //     onChangeIndex: (cardIndex: number) => {
        //         if (!cardset.isValidIndex(cardIndex)) return;
        //         // console.log(cardset.getCardByIndex(cardIndex).getName());
        //     },
        //     onMarked: (cardIndex: number) => {
        //         if (!cardset.isValidIndex(cardIndex)) return;
        //         // console.log(cardset.getCardByIndex(cardIndex).getName());
        //     },
        //     onCompleted: (cardIndexes: number[]) => {
        //         cardset.highlightCardsByIndexes(cardIndexes);
        //         const commandWindow = CommandWindow.createBottom(this, 'Complete your choice?', [
        //             {
        //                 description: 'Yes',
        //                 onSelect: () => {
        //                     console.log('Selected cards:', cardIndexes);
        //                 }
        //             },
        //             {
        //                 description: 'No',
        //                 onSelect: () => {
        //                     cardset.restoreSelectMode();
        //                 }
        //             },
        //         ]);
        //         commandWindow.open();
        //     },
        //     onLeave: () => {
        //         cardset.reset();
        //         cardset.closeAllCardsDominoMovement();
        //     },
        // };
        // const colorPoints: ColorsPoints = {
        //     red: cardsData.filter(card => card.color === 'red').length,
        //     blue: cardsData.filter(card => card.color === 'blue').length,
        //     green: 0,
        //     black: 0,
        //     white: 0,
        //     orange: 0
        // };
        // cardset.selectModeOne(events);
        // cardset.selectModeMany(events, colorPoints);
        // cardset.closeAllCardsDominoMovement();
        // cardset.disablePowerCards();
        // cardset.disableBattleCards();

        // const cardset = new Cardset(this, [cards[0]], 200, 200);
        // const card = cardset.getCardByIndex(0);
        // card.expand({ onComplete: (card?: Card) => {
        //     if (card) card.shrink(); 
        // }});
        // card.shrink({ onComplete: (card?: Card) => {
        //     if (card) card.expand(); 
        // }});

        // card.flash({
        //     color: 0xff0000,
        //     delay: 500,
        // });
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
