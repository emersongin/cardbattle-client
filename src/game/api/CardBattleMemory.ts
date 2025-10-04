import { v4 as uuidv4 } from 'uuid';
import { CardBattle } from '@api/CardBattle';
import { ADD_COLOR_POINTS, AP, BATTLE, BATTLE_CARDS_SET, DECK, DRAW_CARDS, END_MINI_GAME, HAND, HP, IN_LOBBY, IN_PLAY, PASS, POWER, SET_DECK, TRASH, WAITING_TO_PLAY, WINS } from '@constants/keys';
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from '@constants/colors';
import { BoardWindowData } from "@objects/BoardWindowData";
import { CardData } from "@objects/CardData";
import { CardsFolderData } from "@objects/CardsFolderData";
import { OpponentData } from "@objects/OpponentData";
import { PowerActionData } from "@objects/PowerActionData";
import { PowerCardPlayData } from "@objects/PowerCardPlayData";
import { RoomData } from "@objects/RoomData";
import { PowerActionUpdatesData } from '@objects/PowerActionUpdatesData';
import { CardType } from '@game/types/CardType';
import { ArrayUtil } from '@utils/ArrayUtil';
import { MathUtil } from '@utils/MathUtil';
import { CardColorType } from '../types/CardColorType';
import { NONE } from 'phaser';
import { Card } from '../ui/Card/Card';
import { PowerCard } from '../ui/Card/PowerCard';
import { BattleCard } from '../ui/Card/BattleCard';
import { VueScene } from '../scenes/VueScene';
import { BattlePointsData } from '../objects/BattlePointsData';

const delayMock = 100;

const battleCards = [
    {
        id: 'B1',
        number: 1,
        name: 'Battle Card n° 1',
        description: 'This is a battle card description.',
        color: RED as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 5,
        hp: 5,
        cost: 2,
        effectType: NONE,
        effectDescription: 'none',
    },
    {
        id: 'B2',
        number: 2,
        name: 'Battle Card n° 2',
        description: 'This is another battle card description.',
        color: GREEN as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 4,
        hp: 6,
        cost: 2,
        effectType: NONE,
        effectDescription: 'none',
    },
    {
        id: 'B3',
        number: 3,
        name: 'Battle Card n° 3',
        description: 'This is yet another battle card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        hp: 4,
        ap: 6,
        cost: 2,
        effectType: NONE,
        effectDescription: 'none',
    },
    {
        id: 'B4',
        number: 4,
        name: 'Battle Card n° 4',
        description: 'This is a different battle card description.',
        color: BLACK as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        hp: 7,
        ap: 3,
        cost: 2,
        effectType: NONE,
        effectDescription: 'none',
    },
    {
        id: 'B5',
        number: 5,
        name: 'Battle Card n° 5',
        description: 'This is a unique battle card description.',
        color: WHITE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        hp: 3,
        ap: 7,
        cost: 2,
        effectType: NONE,
        effectDescription: 'none',
    },
    {
        id: 'B6',
        number: 6,
        name: 'Battle Card n° 6',
        description: 'This is a special battle card description.',
        color: ORANGE as CardColorType,
        image: 'card-picture',
        type: BATTLE as CardType,
        ap: 2,
        hp: 8,
        cost: 0,
        effectType: NONE,
        effectDescription: 'none',
    }
];

const powerCards = [
    {
        id: 'P1',
        number: 7,
        name: 'Add Color Points Power Card n° 1',
        description: 'This is a test power card description.',
        color: RED as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    },
    {
        id: 'P2',
        number: 8,
        name: 'Add Color Points Power Card n° 2',
        description: 'This is another test power card description.',
        color: GREEN as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    },
    {
        id: 'P3',
        number: 9,
        name: 'Add Color Points Power Card n° 3',
        description: 'This is yet another test power card description.',
        color: BLUE as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    },
    {
        id: 'P4',
        number: 10,
        name: 'Add Color Points Power Card n° 4',
        description: 'This is a different test power card description.',
        color: BLACK as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    },
    {
        id: 'P5',
        number: 11,
        name: 'Add Color Points Power Card n° 5',
        description: 'This is a unique test power card description.',
        color: WHITE as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    },
    {
        id: 'P6',
        number: 12,
        name: 'Add Color Points Power Card n° 6',
        description: 'This is a special test power card description.',
        color: ORANGE as CardColorType,
        image: 'card-picture',
        type: POWER as CardType,
        effectType: ADD_COLOR_POINTS,
        effectDescription: 'This card is used for testing power effects.',
        ap: 0,
        hp: 0,
        cost: 0,
    }
];

const cardsMock = [
    ...battleCards, 
    ...powerCards
] as CardData[];
const redDeck = createDeck(cardsMock, 40);
const greenDeck = createDeck(cardsMock, 40);
const blueDeck = createDeck(cardsMock, 40);

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
] as { id: string; deck: CardData[] }[];

let counter = 0;

export default class CardBattleMemory implements CardBattle {
    #roomId: string = '';
    #whoPlayMiniGame: string = '';
    #firstPlayer: string = '';
    #powerActionUpdates: PowerActionUpdatesData[] = [];
    // player is the room creator
    #playerId: string = '';
    #playerStep: string = 'NONE';
    #playerBoard: BoardWindowData = {
        [AP]: 0,
        [HP]: 0,
        [RED]: 0,
        [GREEN]: 0,
        [BLUE]: 0,
        [BLACK]: 0,
        [WHITE]: 0,
        [HAND]: 0,
        [DECK]: 0,
        [TRASH]: 0,
        [WINS]: 0,
        [PASS]: false,
    };
    #playerDeck: Card[] = [];
    #playerHand: Card[] = [];
    #playerTrash: Card[] = [];
    #playerBattleCardset: BattleCard[] = [];
    // opponent is the one who joins the room
    #opponentId: string = '';
    #opponentStep: string = 'NONE';
    #opponentBoard: BoardWindowData = {
        [AP]: 0,
        [HP]: 0,
        [RED]: 0,
        [GREEN]: 0,
        [BLUE]: 0,
        [BLACK]: 0,
        [WHITE]: 0,
        [HAND]: 0,
        [DECK]: 0,
        [TRASH]: 0,
        [WINS]: 0,
        [PASS]: false,
    };
    #opponentDeck: Card[] = [];
    #opponentHand: Card[] = [];
    #opponentTrash: Card[] = [];
    #opponentBattleCardset: BattleCard[] = [];

    constructor(readonly scene: VueScene) {}

    getTotalCardsInDeck(): number {
        return this.#playerDeck.length;
    }

    createRoom(): Promise<RoomData> {
        return new Promise((resolve) => {
            const roomId = uuidv4();
            const playerId = uuidv4();
            this.#setRoomId(roomId);
            this.#setPlayerId(playerId);
            this.#setPlayerStep(IN_LOBBY);
            setTimeout(() => resolve({ roomId, playerId }), delayMock);
        });
    }

    #setRoomId(roomId: string): void {
        this.#roomId = roomId;
    }

    #setPlayerId(playerId: string): void {
        this.#playerId = playerId;
    }

    #setPlayerStep(step: string): void {
        this.#playerStep = step;
    }

    #setPlayerDeck(deck: Card[]): void {
        this.#playerDeck = deck;
    }

    #setPlayerHand(hand: Card[]): void {
        this.#playerHand = hand;
    }

    #setOpponentId(opponentId: string): void {
        this.#opponentId = opponentId;
    }

    #setOpponentStep(step: string): void {
        this.#opponentStep = step;
    }

    #setOpponentDeck(deck: Card[]): void {
        this.#opponentDeck = deck;
    }

    #setOpponentHand(hand: Card[]): void {
        this.#opponentHand = hand;
    }

    #setWhoPlayMiniGameId(playerId: string): void {
        this.#whoPlayMiniGame = playerId;
    }

    #setFirstPlayer(playerId: string): void {
        this.#firstPlayer = playerId;
    }

    #isRoom(roomId: string): boolean {
        return this.#roomId === roomId;
    }

    #isPlayer(playerId: string): boolean {
        return this.#playerId === playerId;
    }

    #isOpponent(opponentId: string): boolean {
        return this.#opponentId === opponentId;
    }

    #isPlayerStep(step: string): boolean {
        return this.#playerStep === step;
    }

    #isOpponentStep(step: string): boolean {
        return this.#opponentStep === step;
    }

    #isWhoPlayMiniGameId(playerId: string): boolean {
        return this.#whoPlayMiniGame === playerId;
    }

    #isPlayFirst(playerId: string): boolean {
        return this.#firstPlayer === playerId;
    }

    isOpponentJoined(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#isOpponentStep(IN_LOBBY));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#isPlayerStep(IN_LOBBY));
                };
            }, delayMock);
        });
    }

    listenOpponentJoined(playerId: string, callback: (isOpponentJoined: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    //mock
                    this.#setOpponentStep(IN_LOBBY);
                    // mock
                    callback(this.#isOpponentStep(IN_LOBBY));
                };
                if (this.#isOpponent(playerId)) {
                    callback(this.#isPlayerStep(IN_LOBBY));
                };
                resolve();
            }, delayMock);
        });
    }

    joinRoom(roomId: string): Promise<RoomData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isRoom(roomId)) {
                    const opponentId = uuidv4();
                    this.#setOpponentId(opponentId);
                    this.#setOpponentStep(IN_LOBBY);
                    this.#setWhoPlayMiniGameId(Math.random() < 0.5 ? this.#playerId : this.#opponentId);
                }
                resolve({ roomId, playerId: this.#opponentId });
            }, delayMock);
        });
    }

    getOpponentData(playerId: string, callback: (opponent: OpponentData) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    callback({
                        name: 'Opponent',
                        description: 'This is the opponent\'s description.'
                    });
                };
                if (this.#isOpponent(playerId)) {
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
            const deck = ArrayUtil.clone(folders[folderIndex].deck || []);
            if (this.#isPlayer(playerId)) {
                this.#setPlayerDeck(deck.map(card => this.#createCardByType(card)));
                this.#setPlayerStep(SET_DECK);
                this.#playerBoard[DECK] = this.#playerDeck.length;
                //mock
                this.#setOpponentDeck(ArrayUtil.clone(redDeck.map(card => this.#createCardByType(card))));
                this.#setOpponentStep(SET_DECK);
                this.#opponentBoard[DECK] = this.#opponentDeck.length;
                // mock
            };
            if (this.#isOpponent(playerId)) {
                this.#setOpponentDeck(deck.map(card => this.#createCardByType(card)));
                this.#setOpponentStep(SET_DECK);
                this.#opponentBoard[DECK] = deck.length;
            };
            setTimeout(() => resolve(true), delayMock);
        });
    }

    #createCardByType(card: CardData): Card {
        if (card.type === POWER) {
            return new PowerCard(this.scene, card);
        }
        if (card.type === BATTLE) {
            return new BattleCard(this.scene, card);
        }
        throw new Error('Card type not recognized');
    }

    isOpponentDeckSet(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#isOpponentStep(SET_DECK));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#isPlayerStep(SET_DECK));
                };
            }, delayMock);
        });
    }

    listenOpponentDeckSet(playerId: string, callback: (isDeckSet?: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    this.#setOpponentStep(SET_DECK);
                    callback(this.#isOpponentStep(SET_DECK));
                };
                if (this.#isOpponent(playerId)) {
                    this.#setPlayerStep(SET_DECK);
                    callback(this.#isPlayerStep(SET_DECK));
                };
                resolve();
            }, delayMock);
        });
    }

    isPlayMiniGame(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#isWhoPlayMiniGameId(this.#playerId));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#isWhoPlayMiniGameId(this.#opponentId));
                };
            }, delayMock);
        });
    }

    setMiniGameChoice(playerId: string, choice: string): Promise<void> {
        return new Promise(async (resolve) => {
            if (this.#isPlayer(playerId)) {
                this.#setPlayerStep(END_MINI_GAME);
            };
            if (this.#isOpponent(playerId)) {
                this.#setOpponentStep(END_MINI_GAME);
            };
            const isWhite = (choice === WHITE);
            const firstPlay = this.#isPlayer(playerId) 
                ? (isWhite ? this.#playerId : this.#opponentId) 
                : (isWhite ? this.#opponentId : this.#playerId);
            this.#setFirstPlayer(firstPlay);
            setTimeout(() => resolve(), delayMock);
        });
    }

    listenOpponentEndMiniGame(playerId: string, callback: (choice: string) => void): Promise<void> {
        return new Promise((resolve) => {
            if (this.#isPlayer(playerId) && this.#isWhoPlayMiniGameId(this.#opponentId)) {
                //mock, resultado false
                this.#setFirstPlayer(this.#playerId);
                // mock
                this.#setPlayerStep(END_MINI_GAME);
            };
            if (this.#isOpponent(playerId) && this.#isWhoPlayMiniGameId(this.#playerId)) {
                //mock, resultado false
                this.#setFirstPlayer(this.#opponentId);
                // mock
                this.#setOpponentStep(END_MINI_GAME);
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
                if (this.#isPlayer(playerId)) {
                    resolve(this.#isOpponentStep(DRAW_CARDS));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#isPlayerStep(DRAW_CARDS));
                };
            }, delayMock);
        });
    }

    setReadyDrawCards(playerId: string): Promise<void> {
        return new Promise((resolve) => {
            if (this.#isPlayer(playerId)) {
                this.#setPlayerStep(DRAW_CARDS);
            };
            if (this.#isOpponent(playerId)) {
                this.#setOpponentStep(DRAW_CARDS);
            };
            if (this.#isPlayerStep(DRAW_CARDS) && this.#isOpponentStep(DRAW_CARDS)) {
                this.#drawCards();
                this.#setPointsToBoard(this.#playerId);
                this.#setPointsToBoard(this.#opponentId);
            }
            setTimeout(() => resolve(), delayMock);
        });
    }

    #drawCards(): void {
        this.#shufflePlayerDeck();
        this.#shuffleOpponentDeck();
        this.#drawPlayerCards();
        this.#drawOpponentCards();
    }

    #shufflePlayerDeck(): void {
        this.#playerDeck = ArrayUtil.shuffle(this.#playerDeck);
    }

    #drawPlayerCards(): void {
        this.#setPlayerHand(this.#playerDeck.splice(0, 6));
    }

    #shuffleOpponentDeck(): void {
        this.#opponentDeck = ArrayUtil.shuffle(this.#opponentDeck);
    }

    #drawOpponentCards(): void {
        this.#setOpponentHand(this.#opponentDeck.splice(0, 6));
    }

    listenOpponentDrawCards(playerId: string, callback: (isDrawCards: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                if (this.#isPlayer(playerId)) {
                    // mock
                    this.setReadyDrawCards(this.#opponentId);
                    // mock
                    callback(this.#isOpponentStep(DRAW_CARDS));
                };
                if (this.#isOpponent(playerId)) {
                    callback(this.#isPlayerStep(DRAW_CARDS));
                };
                resolve();
            }, delayMock);
        });
    }

    #setPointsToBoard(playerId: string): void {
        if (this.#isPlayer(playerId)) {
            this.#playerBoard[RED] += this.#playerHand.filter(card => card.getColor() === RED).length;
            this.#playerBoard[GREEN] += this.#playerHand.filter(card => card.getColor() === GREEN).length;
            this.#playerBoard[BLUE] += this.#playerHand.filter(card => card.getColor() === BLUE).length;
            this.#playerBoard[BLACK] += this.#playerHand.filter(card => card.getColor() === BLACK).length;
            this.#playerBoard[WHITE] += this.#playerHand.filter(card => card.getColor() === WHITE).length;
            this.#playerBoard[DECK] = this.#playerDeck.length;
            this.#playerBoard[HAND] = this.#playerHand.length;
            this.#playerBoard[TRASH] = this.#playerTrash.length;
            this.#setPlayerStep(WAITING_TO_PLAY);
        };
        if (this.#isOpponent(playerId)) {
            this.#opponentBoard[RED] += this.#opponentHand.filter(card => card.getColor() === RED).length;
            this.#opponentBoard[GREEN] += this.#opponentHand.filter(card => card.getColor() === GREEN).length;
            this.#opponentBoard[BLUE] += this.#opponentHand.filter(card => card.getColor() === BLUE).length;
            this.#opponentBoard[BLACK] += this.#opponentHand.filter(card => card.getColor() === BLACK).length;
            this.#opponentBoard[WHITE] += this.#opponentHand.filter(card => card.getColor() === WHITE).length;
            this.#opponentBoard[DECK] = this.#opponentDeck.length;
            this.#opponentBoard[HAND] = this.#opponentHand.length;
            this.#opponentBoard[TRASH] = this.#opponentTrash.length;
            this.#setOpponentStep(WAITING_TO_PLAY);
        };
    }
    
    getBoard(playerId: string): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve({
                        [AP]: this.#playerBoard[AP],
                        [HP]: this.#playerBoard[HP],
                        [RED]: this.#playerBoard[RED],
                        [GREEN]: this.#playerBoard[GREEN],
                        [BLUE]: this.#playerBoard[BLUE],
                        [BLACK]: this.#playerBoard[BLACK],
                        [WHITE]: this.#playerBoard[WHITE],
                        [HAND]: this.#playerBoard[HAND],
                        [DECK]: this.#playerBoard[DECK],
                        [TRASH]: this.#playerBoard[TRASH],
                        [WINS]: this.#playerBoard[WINS],
                        [PASS]: this.#playerBoard[PASS]
                    });
                };
                if (this.#isOpponent(playerId)) {
                    resolve({
                        [AP]: this.#opponentBoard[AP],
                        [HP]: this.#opponentBoard[HP],
                        [RED]: this.#opponentBoard[RED],
                        [GREEN]: this.#opponentBoard[GREEN],
                        [BLUE]: this.#opponentBoard[BLUE],
                        [BLACK]: this.#opponentBoard[BLACK],
                        [WHITE]: this.#opponentBoard[WHITE],
                        [HAND]: this.#opponentBoard[HAND],
                        [DECK]: this.#opponentBoard[DECK],
                        [TRASH]: this.#opponentBoard[TRASH],
                        [WINS]: this.#opponentBoard[WINS],
                        [PASS]: this.#opponentBoard[PASS]
                    });
                };
            }, delayMock);
        });
    }
    
    getOpponentBoard(playerId: string): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve({
                        [AP]: this.#opponentBoard[AP],
                        [HP]: this.#opponentBoard[HP],
                        [RED]: this.#opponentBoard[RED],
                        [GREEN]: this.#opponentBoard[GREEN],
                        [BLUE]: this.#opponentBoard[BLUE],
                        [BLACK]: this.#opponentBoard[BLACK],
                        [WHITE]: this.#opponentBoard[WHITE],
                        [HAND]: this.#opponentBoard[HAND],
                        [DECK]: this.#opponentBoard[DECK],
                        [TRASH]: this.#opponentBoard[TRASH],
                        [WINS]: this.#opponentBoard[WINS],
                        [PASS]: this.#opponentBoard[PASS]
                    });
                };
                if (this.#isOpponent(playerId)) {
                    resolve({
                        [AP]: this.#playerBoard[AP],
                        [HP]: this.#playerBoard[HP],
                        [RED]: this.#playerBoard[RED],
                        [GREEN]: this.#playerBoard[GREEN],
                        [BLUE]: this.#playerBoard[BLUE],
                        [BLACK]: this.#playerBoard[BLACK],
                        [WHITE]: this.#playerBoard[WHITE],
                        [HAND]: this.#playerBoard[HAND],
                        [DECK]: this.#playerBoard[DECK],
                        [TRASH]: this.#playerBoard[TRASH],
                        [WINS]: this.#playerBoard[WINS],
                        [PASS]: this.#playerBoard[PASS]
                    });
                };
            }, delayMock);
        });
    }

    getCardsFromHand(playerId: string): Promise<Card[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#playerHand.map(card => this.#enableCard(card)));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentHand.map(card => this.#enableCard(card)));
                };
            }, delayMock);
        });
    }

    #enableCard(card: Card): Card {
        card.faceUp();
        card.enable();
        return card;
    }

    getOpponentCardsFromHand(playerId: string): Promise<Card[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#opponentHand.map(card => this.#enableCard(card)))
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#playerHand.map(card => this.#enableCard(card)));
                };
            }, delayMock);
        });
    }

    isStartPlaying(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#isPlayFirst(playerId));
            }, delayMock);
        });
    }

    setPlaying(playerId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    this.#setPlayerStep(IN_PLAY);
                };
                if (this.#isOpponent(playerId)) {
                    this.#setOpponentStep(IN_PLAY);
                };
                resolve();
            }, delayMock);
        });
    }

    pass(playerId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    this.#setPlayerStep(PASS);
                };
                if (this.#isOpponent(playerId)) {
                    this.#setOpponentStep(PASS);
                };
                resolve();
            }, delayMock);
        });
    }

    getPowerCardById(playerId: string, cardId: string): Promise<PowerCard> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#playerHand.find(card => card.getId() === cardId) as PowerCard);
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentHand.find(card => card.getId() === cardId) as PowerCard);
                };
            }, delayMock);
        });
    }

    getFieldPowerCards(): Promise<PowerCard[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const powerCards = this.#powerActionUpdates.map((update) => update.powerAction.powerCard);
                resolve(powerCards.map(card => this.#enableCard(card) as PowerCard));
            }, delayMock);
        });
    }

    makePowerCardPlay(playerId: string, powerAction: PowerActionData): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const powerCardId = powerAction.powerCard.getId();
                this.#powerActionUpdates.push({
                    playerId,
                    powerAction,
                    playerSincronized: false,
                    opponentSincronized: false,
                });
                if (this.#isPlayer(playerId)) {
                    await this.#removePowerCardInHandById(this.#playerId, powerCardId);

                    this.#setPlayerStep(PASS);
                    if (!await this.isPowerfieldLimitReached()) {
                        this.#setOpponentStep(IN_PLAY);
                    }
                };
                if (this.#isOpponent(playerId)) {
                    await this.#removePowerCardInHandById(this.#opponentId, powerCardId);
                    this.#setOpponentStep(PASS);
                    if (!await this.isPowerfieldLimitReached()) {
                        this.#setPlayerStep(IN_PLAY);
                    }
                };
                resolve();
            }, delayMock);
        });
    }

    #removePowerCardInHandById(playerId: string, powerCardId: string): Promise<void> {
        return new Promise((resolve) => {
            if (this.#isPlayer(playerId)) {
                this.#playerHand = this.#playerHand.filter((card) => card.getId() !== powerCardId);
            };
            if (this.#isOpponent(playerId)) {
                this.#opponentHand = this.#opponentHand.filter((card) => card.getId() !== powerCardId);
            };
            setTimeout(() => resolve(), delayMock);
        });
    }

    isPowerfieldLimitReached(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#powerActionUpdates.length >= 3);
            }, delayMock);
        });
    }

    hasPowerCardsInField(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#powerActionUpdates.length > 0);
            }, delayMock);
        });
    }

    allPass(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#isPlayerStep(PASS) && this.#isOpponentStep(PASS));
            }, delayMock);
        });
    }

    isOpponentPassed(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#isOpponentStep(PASS));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#isPlayerStep(PASS));
                };
            }, delayMock);
        });
    }

    listenOpponentPlay(playerId: string, callback: (play: PowerCardPlayData) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    // mock
                    const powerCard = this.#opponentHand.find(card => card.type === POWER);
                    if (counter === 0 && powerCard) {
                        counter++;
                        const powerAction = { powerCard } as PowerActionData;
                        this.makePowerCardPlay(this.#opponentId, powerAction);
                        callback({
                            pass: false,
                            powerAction
                        });
                    } else {
                        this.#setOpponentStep(PASS);
                        callback({
                            pass: true,
                            powerAction: null
                        });
                    }
                    // mock
                };
                if (this.#isOpponent(playerId)) {
                    // mock
                    this.#setPlayerStep(PASS);
                    callback({
                        pass: true,
                        powerAction: null
                    });
                    // mock
                };
                resolve();
            }, delayMock);
        });
    }

    hasPowerCardInHand(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#playerHand.some(card => card.type === POWER));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentHand.some(card => card.type === POWER));
                };
            }, delayMock);
        });
    }

    listenNextPowerCard(playerId: string, callback: (powerAction: PowerActionData, belongToPlayer: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const powerUpdates = this.#powerActionUpdates.filter(update => !update.playerSincronized);
                    if (powerUpdates.length > 0) {
                        const lastPowerUpdates = powerUpdates.pop();
                        if (lastPowerUpdates) {
                            callback(lastPowerUpdates.powerAction, this.#isPlayer(lastPowerUpdates.playerId));
                        }
                    }
                };
                if (this.#isOpponent(playerId)) {
                    const powerUpdates = this.#powerActionUpdates.filter(update => !update.opponentSincronized);
                    if (powerUpdates.length > 0) {
                        const lastPowerUpdates = powerUpdates.pop();
                        if (lastPowerUpdates) {
                            callback(lastPowerUpdates.powerAction, this.#isOpponent(lastPowerUpdates.playerId));
                        }
                    }
                };
                resolve();
            }, delayMock);
        });
    }

    setPowerActionCompleted(playerId: string, powerCardId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const update = this.#powerActionUpdates.find(update => update.powerAction.powerCard.getId() === powerCardId);
                    if (update) update.playerSincronized = true;
                    // mock
                    if (update) update.opponentSincronized = true;
                };
                if (this.#isOpponent(playerId)) {
                    const update = this.#powerActionUpdates.find(update => update.powerAction.powerCard.getId() === powerCardId);
                    if (update) update.opponentSincronized = true;
                };
                this.#removePowerCardSincronized();
                resolve();
            }, delayMock);
        });
    }

    #removePowerCardSincronized(): void {
        this.#powerActionUpdates = this.#powerActionUpdates.filter(update => {
            if (update.playerSincronized && update.opponentSincronized) {
                if (this.#isPlayer(update.playerId)) {
                    this.#playerTrash.push(update.powerAction.powerCard);
                    this.#playerBoard[TRASH] = this.#playerTrash.length;
                    return;
                };
                if (this.#isOpponent(update.playerId)) {
                    this.#opponentTrash.push(update.powerAction.powerCard);
                    this.#opponentBoard[TRASH] = this.#opponentTrash.length;
                    return;
                };
            }
            return !update.playerSincronized || !update.opponentSincronized;
        });
    }

    hasPowerCardUpdates(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const hasUpdates = this.#powerActionUpdates.some(update => update.playerSincronized === false);
                    if (!hasUpdates) {
                        this.#setPlayerStep(WAITING_TO_PLAY);
                        // mock
                        this.#setOpponentStep(WAITING_TO_PLAY);
                        // mock
                    }
                    resolve(hasUpdates);
                };
                if (this.#isOpponent(playerId)) {
                    const hasUpdates = this.#powerActionUpdates.some(update => update.opponentSincronized === false);
                    if (!hasUpdates) {
                        this.#setOpponentStep(WAITING_TO_PLAY);
                    }
                    resolve(hasUpdates);
                };
            }, delayMock);
        });
    }

    listenOpponentPowerActionUpdates(playerId: string, callback: (isEnd: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const powerCards = this.#powerActionUpdates.filter(update => update.opponentSincronized === false);
                    callback(powerCards.length === 0);
                };
                if (this.#isOpponent(playerId)) {
                    const powerCards = this.#powerActionUpdates.filter(update => update.playerSincronized === false);
                    callback(powerCards.length === 0);
                };
                resolve();
            }, delayMock);
        });
    }

    #hasEnoughPointsByColorAndCost(cardColor: CardColorType, cardCost: number, boardWindowData: BoardWindowData): boolean {
        if (cardColor === ORANGE) return true;
        switch (cardColor) {
            case RED:
                return boardWindowData[RED] >= cardCost;
            case GREEN:
                return boardWindowData[GREEN] >= cardCost;
            case BLUE:
                return boardWindowData[BLUE] >= cardCost;
            case BLACK:
                return boardWindowData[BLACK] >= cardCost;
            case WHITE:
                return boardWindowData[WHITE] >= cardCost;
            default:
                return true;
        }
    }

    setBattleCards(playerId: string, cardIds: string[]): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const cards = this.#playerHand.filter(card => cardIds.includes(card.getId())) as BattleCard[];
                    this.#removeBoardPointsByBattleCards(cards, this.#playerBoard);
                    this.#playerBattleCardset = cards;
                    this.#playerHand = this.#playerHand.filter(card => !cardIds.includes(card.getId()));
                    const battePoints = this.#getBattlePointsFromBattleCards(this.#playerId);
                    this.#playerBoard[AP] = battePoints[AP];
                    this.#playerBoard[HP] = battePoints[HP];
                    this.#setPlayerStep(BATTLE_CARDS_SET);
                }
                if (this.#isOpponent(playerId)) {
                    const cards = this.#opponentHand.filter(card => cardIds.includes(card.getId())) as BattleCard[];
                    this.#removeBoardPointsByBattleCards(cards, this.#opponentBoard);
                    this.#opponentBattleCardset = cards;
                    this.#opponentHand = this.#opponentHand.filter(card => !cardIds.includes(card.getId()));
                    const battePoints = this.#getBattlePointsFromBattleCards(this.#opponentId);
                    this.#opponentBoard[AP] = battePoints[AP];
                    this.#opponentBoard[HP] = battePoints[HP];
                    this.#setOpponentStep(BATTLE_CARDS_SET);
                }
                resolve();
            }, delayMock);
        });
    }

    #removeBoardPointsByBattleCards(cards: BattleCard[], boardWindowData: BoardWindowData): void {
        cards.forEach(card => {
            switch (card.getColor()) {
                case RED:
                    boardWindowData[RED] -= card.getCost();
                    break;
                case GREEN:
                    boardWindowData[GREEN] -= card.getCost();
                    break;
                case BLUE:
                    boardWindowData[BLUE] -= card.getCost();
                    break;
                case BLACK:
                    boardWindowData[BLACK] -= card.getCost();
                    break;
                case WHITE:
                    boardWindowData[WHITE] -= card.getCost();
                    break;
                case ORANGE:
                    break;
            }
        });
    }

    #getBattlePointsFromBattleCards(playerId: string): BattlePointsData {
        if (this.#isPlayer(playerId)) {
            const battleCards = this.#playerBattleCardset.filter(card => this.#isBattleCard(card)) as BattleCard[];
            const apTotal = battleCards.reduce((sum, card) => sum + card.getAp(), 0);
            const hpTotal = battleCards.reduce((sum, card) => sum + card.getHp(), 0);
            return { [AP]: apTotal, [HP]: hpTotal };
        }
        if (this.#isOpponent(playerId)) {
            const battleCards = this.#opponentBattleCardset.filter(card => this.#isBattleCard(card)) as BattleCard[];
            const apTotal = battleCards.reduce((sum, card) => sum + card.getAp(), 0);
            const hpTotal = battleCards.reduce((sum, card) => sum + card.getHp(), 0);
            return { [AP]: apTotal, [HP]: hpTotal };
        }
        return { [AP]: 0, [HP]: 0 };
    }

    #isBattleCard(card: Card): Boolean {
        return card instanceof BattleCard;
    }

    isOpponentBattleCardsSet(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#isOpponentStep(BATTLE_CARDS_SET));
                }
                if (this.#isOpponent(playerId)) {
                    resolve(this.#isPlayerStep(BATTLE_CARDS_SET));
                }
            }, delayMock);
        });
    }

    listenOpponentBattleCardsSet(playerId: string, callback: (isSet: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    // mock
                    let boardOpponentClone = { ...this.#opponentBoard };
                    const battleCards = this.#opponentHand.filter((card: Card) => {
                        if (card instanceof PowerCard) return;
                        if (
                            card instanceof BattleCard
                            && this.#hasEnoughPointsByColorAndCost(card.getColor(), card.getCost(), boardOpponentClone)
                        ) {
                            this.#removeBoardPointsByBattleCards([card], boardOpponentClone);
                            return true;
                        }
                    });
                    const cardIds = battleCards.map(card => card.getId());
                    this.setBattleCards(this.#opponentId, cardIds);
                    // mock
                    callback(this.#isOpponentStep(BATTLE_CARDS_SET));
                }
                if (this.#isOpponent(playerId)) {
                    callback(this.#isPlayerStep(BATTLE_CARDS_SET));
                }
                resolve();
            }, delayMock);
        });
    }

    // #isPowerCardData(card: CardData): card is PowerCardData {
    //     return (card as PowerCardData).effectType !== undefined && (card as PowerCardData).effectDescription !== undefined;
    // }

    getBattleCards(playerId: string): Promise<BattleCard[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#playerBattleCardset.map(card => this.#enableCard(card)) as BattleCard[]);
                }
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentBattleCardset.map(card => this.#enableCard(card)) as BattleCard[]);
                }
            }, delayMock);
        });
    }

    getOpponentBattleCards(playerId: string): Promise<BattleCard[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#opponentBattleCardset.map(card => this.#enableCard(card)) as BattleCard[]);
                }
                if (this.#isOpponent(playerId)) {
                    resolve(this.#playerBattleCardset.map(card => this.#enableCard(card)) as BattleCard[]);
                }
            }, delayMock);
        }); 
    }

    getBattlePointsFromBoard(playerId: string): Promise<BattlePointsData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve({ [AP]: this.#playerBoard[AP], [HP]: this.#playerBoard[HP] });
                }
                if (this.#isOpponent(playerId)) {
                    resolve({ [AP]: this.#opponentBoard[AP], [HP]: this.#opponentBoard[HP] });
                }
            }, delayMock);
        });
    }

    getOpponentBattlePointsFromBoard(playerId: string): Promise<BattlePointsData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve({ [AP]: this.#opponentBoard[AP], [HP]: this.#opponentBoard[HP] });
                }
                if (this.#isOpponent(playerId)) {
                    resolve({ [AP]: this.#playerBoard[AP], [HP]: this.#playerBoard[HP] });
                }
            }, delayMock);
        });
    }
}