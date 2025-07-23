import { BATTLE, POWER } from '../constants/CardTypes';
import { BLUE, ORANGE } from '../constants/Colors';
import { BoardWindowData, CardData, CardsFolderData, OpponentData } from '../types';
import { CardColors, CardType } from '../ui/Card/Card';
import { CardBattle } from './CardBattle';

const delayMock = 100;

const cards = [
    {
        UUID: '123e4567-e89b-12d3-a456-426614174000',
        number: 1,
        name: 'Test Card',
        description: 'This is a test card description.',
        color: ORANGE as CardColors,
        imageName: 'card-picture',
        hp: 10,
        ap: 5,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        UUID: '123e4567-e89b-12d3-a456-426614174444',
        number: 1,
        name: 'Test Power Card',
        description: 'This is a test power card description.',
        color: BLUE as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-1',
        cost: 1
    },
];

export default class CardBattleSocketIo implements CardBattle {
    duplicate(cards: CardData[], number: number) {
        const duplicatedCards: CardData[] = [];
        for (let i = 0; i < number; i++) {
            duplicatedCards.push(...cards);
        }
        return duplicatedCards;
    }

    getOpponentData(): Promise<OpponentData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 'opponent-1',
                    name: 'First Opponent',
                    description: 'Complete the first opponent to proceed.',
                    completed: false,
                    reward: 100,
                });
            }, delayMock);
        });
    }

    getFolders(): Promise<CardsFolderData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'folder-1',
                        name: 'Folder 1',
                        redPoints: 50,
                        greenPoints: 30,
                        bluePoints: 20,
                        blackPoints: 10,
                        whitePoints: 5,
                        orangePoints: 15
                    },
                    {
                        id: 'folder-2',
                        name: 'Folder 2',
                        redPoints: 50,
                        greenPoints: 30,
                        bluePoints: 20,
                        blackPoints: 10,
                        whitePoints: 5,
                        orangePoints: 15
                    },
                    {
                        id: 'folder-3',
                        name: 'Folder 3',
                        redPoints: 50,
                        greenPoints: 30,
                        bluePoints: 20,
                        blackPoints: 10,
                        whitePoints: 5,
                        orangePoints: 15
                    }
                ]);
            }, delayMock);
        });
    }

    setFolder(folderId: string): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(folderId);
            }, delayMock);
        });
    }

    iGo(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.random() < 0.5);
            }, delayMock);
        });
    }

    listenOpponentChoice(callback: (choice: string) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const choice = Math.random() < 0.5 ? 'White' : 'Black';
                callback(choice);
                resolve();
            }, 1000);
        });
    }

    setOpponentChoice(choice: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Opponent choice set to: ${choice}`);
                resolve();
            }, delayMock);
        });
    }

    drawPlayerCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const playerCards = this.duplicate(cards, 3).reverse();
                resolve(playerCards);
            }, delayMock);
        });
    }

    drawOpponentCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const opponentCards = this.duplicate(cards, 3);
                resolve(opponentCards);
            }, delayMock);
        });
    }

    getPlayerBoardData(): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ap: 0,
                    hp: 0,
                    redPoints: 0,
                    greenPoints: 0,
                    bluePoints: 0,
                    blackPoints: 0,
                    whitePoints: 0,
                    orangePoints: 0,
                    numberOfCardsInHand: 0,
                    numberOfCardsInDeck: 0,
                    numberOfWins: 0
                });
            }, delayMock);
        });
    }
    
    getOpponentBoardData(): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ap: 0,
                    hp: 0,
                    redPoints: 0,
                    greenPoints: 0,
                    bluePoints: 0,
                    blackPoints: 0,
                    whitePoints: 0,
                    orangePoints: 0,
                    numberOfCardsInHand: 0,
                    numberOfCardsInDeck: 0,
                    numberOfWins: 0
                });
            }, delayMock);
        });
    }
}