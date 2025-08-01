import { BATTLE, POWER } from '../constants/CardTypes';
import { BLACK, BLUE, GREEN, RED } from '../constants/Colors';
import { BoardWindowData, CardData, CardsFolderData, OpponentData } from '../types';
import { CardColors, CardType } from '../ui/Card/Card';
import { CardBattle, LoadPhasePlay } from './CardBattle';

const delayMock = 100;

const cards = [
    {
        UUID: '123e4567-e89b-12d3-a456-426614174000',
        number: 1,
        name: 'Test Card',
        description: 'This is a test card description.',
        details: 'This card is used for testing purposes.',
        color: GREEN as CardColors,
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
        details: 'This card is used for testing power effects.',
        color: BLUE as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-1',
        cost: 1
    },
    {
        UUID: '123e4567-e89b-12d3-a456-426614174444',
        number: 1,
        name: 'Test Power Card 2',
        description: 'This is a test power card description.',
        details: 'This card is used for testing power effects.',
        color: RED as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-1',
        cost: 1
    },
    {
        UUID: '123e4567-e89b-12d3-a456-426614174444',
        number: 1,
        name: 'Test Power Card 3',
        description: 'This is a test power card description.',
        details: 'This card is used for testing power effects.',
        color: BLACK as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-1',
        cost: 1
    },
];

export default class CardBattleSocketIo implements CardBattle {
    #playerPass: boolean = false;
    #opponentPassed: boolean = true;

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
                // resolve(Math.random() < 0.5);
                resolve(false);
            }, delayMock);
        });
    }

    listenOpponentStartPhase(callback: (choice: string) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const choice = Math.random() < 0.5 ? 'White' : 'Black';
                callback(choice);
                resolve();
            }, 1000);
        });
    }

    setPlayerChoice(choice: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Player choice set to: ${choice}`);
                resolve();
            }, delayMock);
        });
    }

    drawPlayerCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const playerCards = this.duplicate(cards, 3).slice(0, 6);
                // .reverse();
                resolve(playerCards);
            }, delayMock);
        });
    }

    drawOpponentCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const opponentCards = this.duplicate(cards, 3).slice(0, 6);
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
                    numberOfCardsInDeck: 40,
                    numberOfCardsInTrash: 0,
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
                    numberOfCardsInDeck: 40,
                    numberOfCardsInTrash: 0,
                    numberOfWins: 0
                });
            }, delayMock);
        });
    }

    getPlayerHandCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const playerHandCards = this.duplicate(cards, 3).slice(0, 6);
                resolve(playerHandCards);
            }, delayMock);
        });
    }

    getOpponentHandCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const opponentHandCards = this.duplicate(cards, 3).slice(0, 6);
                resolve(opponentHandCards);
            }, delayMock);
        });
    }

    listenOpponentLoadPhase(callback: (play: LoadPhasePlay) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const play: LoadPhasePlay = {
                    pass: true,
                    powerCard: null
                };
                callback(play);
                resolve();
            }, delayMock);
        });
    }

    allPass(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#playerPass && this.#opponentPassed);
            }, delayMock);
        });
    }

    opponentPassed(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#opponentPassed);
            }, delayMock);
        });
    }

    playerPass(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.#playerPass = true;
                resolve();
            }, delayMock);
        });
    }

    hasPowerCardsInField(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(false);
            }, delayMock);
        });
    }

    getPowerCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const powerCards = this.duplicate(cards.filter(card => card.typeId === POWER), 10).slice(0, 2);
                resolve(powerCards);
            }, delayMock);
        });
    }

    getPlayerPowerCardByIndex(index: number): Promise<CardData> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const cards = await this.getPlayerHandCardsData();
                resolve(cards[index]);
            }, delayMock);
        });
    }
}