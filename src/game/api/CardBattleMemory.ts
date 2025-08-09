import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from '../constants/colors';
import { BATTLE, POWER } from '../constants/keys';
import { BoardWindowData, CardData, CardsFolderData, OpponentData } from '../types';
import { CardColors } from '../ui/Card/types/CardColors';
import { CardType } from '../ui/Card/types/CardType';
import { MathUtil } from '../utils/MathUtil';
import { CardBattle, LoadPhasePlay } from './CardBattle';

const delayMock = 100;

const battleCards = [
    {
        id: 'B1',
        number: 1,
        name: 'Battle Card n° 1',
        description: 'This is a battle card description.',
        details: 'This card is used for battle purposes.',
        color: RED as CardColors,
        imageName: 'card-picture',
        hp: 5,
        ap: 5,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        id: 'B2',
        number: 2,
        name: 'Battle Card n° 2',
        description: 'This is another battle card description.',
        details: 'This card is used for battle purposes.',
        color: GREEN as CardColors,
        imageName: 'card-picture',
        hp: 6,
        ap: 4,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        id: 'B3',
        number: 3,
        name: 'Battle Card n° 3',
        description: 'This is yet another battle card description.',
        details: 'This card is used for battle purposes.',
        color: BLUE as CardColors,
        imageName: 'card-picture',
        hp: 4,
        ap: 6,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        id: 'B4',
        number: 4,
        name: 'Battle Card n° 4',
        description: 'This is a different battle card description.',
        details: 'This card is used for battle purposes.',
        color: BLACK as CardColors,
        imageName: 'card-picture',
        hp: 7,
        ap: 3,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        id: 'B5',
        number: 5,
        name: 'Battle Card n° 5',
        description: 'This is a unique battle card description.',
        details: 'This card is used for battle purposes.',
        color: WHITE as CardColors,
        imageName: 'card-picture',
        hp: 3,
        ap: 7,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    },
    {
        id: 'B6',
        number: 6,
        name: 'Battle Card n° 6',
        description: 'This is a special battle card description.',
        details: 'This card is used for battle purposes.',
        color: ORANGE as CardColors,
        imageName: 'card-picture',
        hp: 8,
        ap: 2,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 1
    }
];

const powerCards = [
    {
        id: 'P1',
        number: 7,
        name: 'Power Card n° 1',
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
        id: 'P2',
        number: 8,
        name: 'Power Card n° 2',
        description: 'This is another test power card description.',
        details: 'This card is used for testing power effects.',
        color: GREEN as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-2',
        cost: 1
    },
    {
        id: 'P3',
        number: 9,
        name: 'Power Card n° 3',
        description: 'This is yet another test power card description.',
        details: 'This card is used for testing power effects.',
        color: BLUE as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-3',
        cost: 1
    },
    {
        id: 'P4',
        number: 10,
        name: 'Power Card n° 4',
        description: 'This is a different test power card description.',
        details: 'This card is used for testing power effects.',
        color: BLACK as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-4',
        cost: 1
    },
    {
        id: 'P5',
        number: 11,
        name: 'Power Card n° 5',
        description: 'This is a unique test power card description.',
        details: 'This card is used for testing power effects.',
        color: WHITE as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-5',
        cost: 1
    },
    {
        id: 'P6',
        number: 12,
        name: 'Power Card n° 6',
        description: 'This is a special test power card description.',
        details: 'This card is used for testing power effects.',
        color: ORANGE as CardColors,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-6',
        cost: 1
    }
];

const redDeck = createDeck([...battleCards, ...powerCards], 40);
const greenDeck = createDeck([...battleCards, ...powerCards], 40);
const blueDeck = createDeck([...battleCards, ...powerCards], 40);

function createDeck(cards: CardData[], number: number) {
    const deck: CardData[] = [];
    for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        const clone = { ...cards[randomIndex] };
        const randomNumber = MathUtil.randomInt(1, 1000);
        const cardId = `${clone.id}-${randomNumber}`;
        clone.id = cardId;
        deck.push(clone);
    }
    console.log(deck);
    return deck;
}

const folders = [
    {
        id: 'f1',
        deck: redDeck
    },
    {
        id: 'f2',
        deck: greenDeck
    },
    {
        id: 'f3',
        deck: blueDeck
    }
];

export default class CardBattleMemory implements CardBattle {
    #playerId: string = 'player-1';
    #opponentId: string = 'opponent-1';
    #playerDeck: CardData[] = folders[0].deck;
    #playerHand: CardData[] = [];
    #opponentDeck: CardData[] = folders[1].deck;
    #opponentHand: CardData[] = [];
    #firstPlayer: string = Math.random() < 0.5 ? this.#playerId : this.#opponentId;
    #playerPass: boolean = false;
    #opponentPassed: boolean = true;
    #powerCardsInField: CardData[] = [];

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
                        id: 'f1',
                        name: 'Folder 1',
                        redPoints: 50,
                        greenPoints: 30,
                        bluePoints: 20,
                        blackPoints: 10,
                        whitePoints: 5,
                        orangePoints: 15
                    },
                    {
                        id: 'f2',
                        name: 'Folder 2',
                        redPoints: 50,
                        greenPoints: 30,
                        bluePoints: 20,
                        blackPoints: 10,
                        whitePoints: 5,
                        orangePoints: 15
                    },
                    {
                        id: 'f3',
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

    setFolder(folderId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const folderIndex = folders.findIndex((f) => f.id === folderId);
                const deck = folders[folderIndex].deck || [];
                this.#playerDeck = deck;
                resolve(true);
            }, delayMock);
        });
    }

    iGo(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#firstPlayer === this.#playerId);
            }, delayMock);
        });
    }

    listenOpponentStartPhase(callback: (choice: string) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const choice = Math.random() < 0.5 ? 'White' : 'Black';
                this.#firstPlayer = choice !== 'White' ? this.#playerId : this.#opponentId;
                callback(choice);
                resolve();
            }, 1000);
        });
    }

    setPlayerChoice(choice: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.#firstPlayer = choice === 'White' ? this.#playerId : this.#opponentId;
                resolve();
            }, delayMock);
        });
    }

    drawPlayerCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const playerCards = this.#playerDeck.splice(0, 6);
                this.#playerHand.push(...playerCards);
                resolve(playerCards);
            }, delayMock);
        });
    }

    drawOpponentCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const opponentCards = this.#opponentDeck.splice(0, 6);
                this.#opponentHand.push(...opponentCards);
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
                    numberOfCardsInHand: this.#playerHand.length,
                    numberOfCardsInDeck: this.#playerDeck.length,
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
                    numberOfCardsInHand: this.#opponentHand.length,
                    numberOfCardsInDeck: this.#opponentDeck.length,
                    numberOfCardsInTrash: 0,
                    numberOfWins: 0
                });
            }, delayMock);
        });
    }

    getPlayerHandCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#playerHand);
            }, delayMock);
        });
    }

    getOpponentHandCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#opponentHand);
            }, delayMock);
        });
    }

    listenOpponentLoadPhase(callback: (play: LoadPhasePlay) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.#opponentPassed = true;
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

    isOpponentPassed(): Promise<boolean> {
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
                resolve(this.#powerCardsInField.length > 0);
            }, delayMock);
        });
    }

    getPowerCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#powerCardsInField);
            }, delayMock);
        });
    }

    getPlayerPowerCardByIndex(index: number): Promise<CardData> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const cards = await this.getPlayerHandCardsData();
                const card = cards[index];
                resolve(card);
            }, delayMock);
        });
    }

    playerMakePowerCardPlay(powerCardId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const cards = await this.getPlayerHandCardsData();
                cards.find((card) => card.id === powerCardId);
                const powercard = cards.find((card) => card.id === powerCardId);
                if (powercard) {
                    this.#powerCardsInField.push(powercard);
                    this.#playerHand = this.#playerHand.filter((card) => card.id !== powerCardId);
                };
                resolve();
            }, delayMock);
        });
    }

    isPowerfieldLimitReached(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#powerCardsInField.length >= 3);
            }, delayMock);
        });
    }
}