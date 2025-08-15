import { v4 as uuidv4 } from 'uuid';
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from '../constants/colors';
import { BATTLE, DRAW_CARDS, END_MINI_GAME, IN_LOBBY, POWER, SET_DECK } from '../constants/keys';
import { BoardWindowData, CardData, CardsFolderData, OpponentData, PowerCardUpdates } from '../types';
import { CardColors } from '../ui/Card/types/CardColors';
import { CardType } from '../ui/Card/types/CardType';
import { MathUtil } from '../utils/MathUtil';
import { CardBattle, LoadPhasePlay } from './CardBattle';
import { RoomData } from '../types/RoomData';
import { PowerCardAction } from '../types/PowerCardAction';
import { ArrayUtil } from '../utils/ArrayUtil';

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
    #roomId: string = '';
    #whoPlayMiniGame: string = '';
    #firstPlayer: string = '';
    #powerCardsInField: PowerCardUpdates[] = [];
    // player is the room creator
    #playerId: string = '';
    #playerState: string = 'NONE';
    #playerPass: boolean = false;
    #playerDeck: CardData[] = [];
    #playerHand: CardData[] = [];
    // opponent is the one who joins the room
    #opponentId: string = '';
    #opponentState: string = 'NONE';
    #opponentPassed: boolean = true;
    #opponentDeck: CardData[] = [];
    #opponentHand: CardData[] = [];

    createRoom(): Promise<RoomData> {
        return new Promise((resolve) => {
            const roomId = uuidv4();
            const playerId = uuidv4();
            this.#roomId = roomId;
            this.#playerId = playerId;
            this.#playerState = IN_LOBBY;
            setTimeout(() => resolve({ roomId, playerId }), delayMock);
        });
    }

    isOpponentJoined(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    resolve(this.#opponentState === IN_LOBBY);
                };
                if (this.#opponentId === playerId) {
                    resolve(this.#playerState === IN_LOBBY);
                };
            }, delayMock);
        });
    }

    listenOpponentJoined(playerId: string, callback: (opponent: OpponentData) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    //mock
                    this.#opponentState = IN_LOBBY;
                    callback({
                        name: 'Opponent',
                        description: 'This is the opponent\'s description.'
                    });
                };
                if (this.#opponentId === playerId) {
                    //mock
                    this.#playerState = IN_LOBBY;
                    callback({
                        name: 'Player',
                        description: 'This is the player\'s description.'
                    });
                };
                resolve();
            }, delayMock);
        });
    }

    joinRoom(roomId: string): Promise<RoomData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#roomId === roomId) {
                    const opponentId = uuidv4();
                    this.#opponentId = opponentId;
                    this.#opponentState = IN_LOBBY;
                    this.#whoPlayMiniGame = Math.random() < 0.5 ? this.#playerId : this.#opponentId;
                }
                resolve({ roomId, playerId: this.#opponentId });
            }, delayMock);
        });
    }

    getOpponentData(playerId: string, callback: (opponent: OpponentData) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    callback({
                        name: 'Opponent',
                        description: 'This is the opponent\'s description.'
                    });
                };
                if (this.#opponentId === playerId) {
                    callback({
                        name: 'Player',
                        description: 'This is the player\'s description.'
                    });
                };
                resolve();
            }, delayMock);
        });
    }

    getFolders(): Promise<CardsFolderData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const foldersData: CardsFolderData[] = folders.map(folder => ({
                    id: folder.id,
                    name: `Folder ${folder.id}`,
                    colorsPoints: {
                        RED: folder.deck.filter(card => card.color === RED).length,
                        GREEN: folder.deck.filter(card => card.color === GREEN).length,
                        BLUE: folder.deck.filter(card => card.color === BLUE).length,
                        BLACK: folder.deck.filter(card => card.color === BLACK).length,
                        WHITE: folder.deck.filter(card => card.color === WHITE).length,
                        ORANGE: folder.deck.filter(card => card.color === ORANGE).length
                    }
                }));
                resolve(foldersData);
            }, delayMock);
        });
    }

    setFolder(playerId: string, folderId: string): Promise<boolean> {
        return new Promise((resolve) => {
            const folderIndex = folders.findIndex((f) => f.id === folderId);
            const deck = folders[folderIndex].deck || [];
            if (this.#playerId === playerId) {
                this.#playerDeck = deck;
                this.#playerState = SET_DECK;
                //mock
                this.#opponentDeck = folders[0].deck;
                this.#opponentState = SET_DECK;
            };
            if (this.#opponentId === playerId) {
                this.#opponentDeck = deck;
                this.#opponentState = SET_DECK;
            };
            setTimeout(() => resolve(true), delayMock);
        });
    }

    isOpponentDeckSet(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    resolve(this.#opponentState === SET_DECK);
                };
                if (this.#opponentId === playerId) {
                    resolve(this.#playerState === SET_DECK);
                };
            }, delayMock);
        });
    }

    listenOpponentDeckSet(playerId: string, callback: (isDeckSet?: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    this.#opponentState = SET_DECK
                    callback(this.#opponentState === SET_DECK);
                };
                if (this.#opponentId === playerId) {
                    this.#playerState = SET_DECK
                    callback(this.#playerState === SET_DECK);
                };
                resolve();
            }, delayMock);
        });
    }

    isPlayMiniGame(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    resolve(this.#whoPlayMiniGame === this.#playerId);
                };
                if (this.#opponentId === playerId) {
                    resolve(this.#whoPlayMiniGame === this.#opponentId);
                };
            }, delayMock);
        });
    }

    setMiniGameChoice(playerId: string, choice: string): Promise<void> {
        return new Promise(async (resolve) => {
            if (this.#playerId === playerId) {
                this.#playerState = END_MINI_GAME;
            };
            if (this.#opponentId === playerId) {
                this.#opponentState = END_MINI_GAME;
            };
            const player = (playerId === this.#playerId);
            const isWhite = (choice === WHITE);
            this.#firstPlayer = player 
                ? (isWhite ? this.#playerId : this.#opponentId) 
                : (isWhite ? this.#opponentId : this.#playerId);
            setTimeout(() => resolve(), delayMock);
        });
    }

    listenOpponentEndMiniGame(playerId: string, callback: (choice: string) => void): Promise<void> {
        return new Promise((resolve) => {
            if (this.#playerId === this.#whoPlayMiniGame && this.#playerId !== playerId) {
                //mock
                this.#firstPlayer = this.#opponentId;
                this.#opponentState = END_MINI_GAME;
            };
            if (this.#opponentId === this.#whoPlayMiniGame && this.#opponentId !== playerId) {
                //mock
                this.#firstPlayer = this.#playerId;
                this.#playerState = END_MINI_GAME;
            };
            setTimeout(() => {
                callback(BLACK);
                resolve();
            }, 1000);
        });
    }

    isOpponentReadyDrawCards(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    resolve(this.#opponentState === DRAW_CARDS);
                };
                if (this.#opponentId === playerId) {
                    resolve(this.#playerState === DRAW_CARDS);
                };
            }, delayMock);
        });
    }

    setReadyDrawCards(playerId: string): Promise<void> {
        return new Promise((resolve) => {
            if (this.#playerId === playerId) {
                this.#playerState = DRAW_CARDS;
            };
            if (this.#opponentId === playerId) {
                this.#opponentState = DRAW_CARDS;
            };
            setTimeout(() => resolve(), delayMock);
        });
    }

    listenOpponentDrawCards(playerId: string, callback: (isDrawCards: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                if (this.#playerId === playerId) {
                    //mock
                    await this.drawCards(this.#opponentId);
                    callback(this.#opponentState === 'DRAW_CARDS');
                };
                if (this.#opponentId === playerId) {
                    //mock
                    await this.drawCards(this.#playerId);
                    callback(this.#playerState === 'DRAW_CARDS');
                };
                resolve();
            }, delayMock);
        });
    }

    drawCards(playerId: string): Promise<void> {
        return new Promise((resolve) => {
            this.#playerDeck = ArrayUtil.shuffle(this.#playerDeck);
            this.#playerHand = this.#playerDeck.splice(0, 6);
            this.#playerState = 'DRAW_CARDS';
            this.#opponentDeck = ArrayUtil.shuffle(this.#opponentDeck);
            this.#opponentHand = this.#opponentDeck.splice(0, 6);
            this.#opponentState = 'DRAW_CARDS';
            setTimeout(() => resolve(), delayMock);
        });
    }

    getBoard(playerId: string): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
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
                };
                if (this.#opponentId === playerId) {
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
                };
            }, delayMock);
        });
    }
    
    getOpponentBoard(playerId: string): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#opponentId === playerId) {
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
                };
                if (this.#playerId === playerId) {
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
                };
            }, delayMock);
        });
    }

    getHandCards(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#playerId === playerId) {
                    resolve(this.#playerHand);
                };
                if (this.#opponentId === playerId) {
                    resolve(this.#opponentHand);
                };
            }, delayMock);
        });
    }

    getOpponentHandCards(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#opponentId === playerId) {
                    resolve(this.#playerHand);
                };
                if (this.#playerId === playerId) {
                    resolve(this.#opponentHand);
                };
            }, delayMock);
        });
    }
















    isGoFirst(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#whoPlayMiniGame === this.#playerId);
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
                // resolve(this.#powerCardsInField);
            }, delayMock);
        });
    }

    getPlayerPowerCardByIndex(index: number): Promise<CardData> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                resolve(this.#playerHand[index]);
            }, delayMock);
        });
    }

    playerMakePowerCardPlay(powerAction: PowerCardAction): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                // const cards = await this.getPlayerHandCardsData();
                // cards.find((card) => card.id === powerCardId);
                // const powercard = cards.find((card) => card.id === powerCardId);
                // if (powercard) {
                //     this.#powerCardsInField.push({
                //         playerId: string;
                //         powerCard: CardData;
                //     });
                //     this.#playerHand = this.#playerHand.filter((card) => card.id !== powerCardId);
                // };
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

    listenNextPowerCard(callback: (playerId: string) => void): Promise<PowerCardUpdates> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // const playerId = this.#firstPlayer;
                // callback(playerId);
                // resolve({ powerCardId: 'next-power-card-id' });
            }, delayMock);
        });
    }

    setPowerActionCompleted(playerId: string, powerCardId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // if (playerId === this.#playerId) {
                //     this.#powerCardsInField = this.#powerCardsInField.filter(card => card.id !== powerCardId);
                // }
                resolve();
            }, delayMock);
        });
    }
}