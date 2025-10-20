import { v4 as uuidv4 } from 'uuid';
import { CardBattle } from '@api/CardBattle';
import { ADD_COLOR_POINTS, AP, BATTLE, BATTLE_CARDS_SET, DECK, DRAW_CARDS, END_MINI_GAME, 
    HAND, HP, IN_LOBBY, IN_PLAY, PASS, POWER, PROCESS_POWER_CARDS, SET_DECK, TRASH, WAITING_TO_PLAY, WINS } from '@constants/keys';
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from '@constants/colors';
import { BoardWindowData } from "@objects/BoardWindowData";
import { CardData } from "@objects/CardData";
import { CardsFolderData } from "@objects/CardsFolderData";
import { OpponentData } from "@objects/OpponentData";
import { PowerActionData } from "@objects/PowerActionData";
import { PowerCardPlay } from "@/game/objects/PowerCardPlay";
import { RoomData } from "@objects/RoomData";
import { CardType } from '@game/types/CardType';
import { ArrayUtil } from '@utils/ArrayUtil';
import { MathUtil } from '@utils/MathUtil';
import { CardColorType } from '../types/CardColorType';
import { Card } from '../ui/Card/Card';
import { PowerCard } from '../ui/Card/PowerCard';
import { BattleCard } from '../ui/Card/BattleCard';
import { VueScene } from '../scenes/VueScene';
import { CommandOption } from '../ui/CommandWindow/CommandOption';
import { BoardWindow } from '../ui/BoardWindow/BoardWindow';
import { BattlePoints } from '../objects/BattlePoints';
import { CardFactory } from '../ui/Card/CardFactory';
import { PowerAction } from '../objects/PowerAction';

const delayMock = 100;

const battleCardsMock = [
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
        cost: 0,
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
        cost: 0,
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
        cost: 0,
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
        cost: 0,
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
        cost: 0,
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
    }
];

const powerCardsMock = [
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
    }
];

const cardsMock = [
    ...battleCardsMock, 
    ...powerCardsMock
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
    #powerActions: PowerActionData[] = [];
    #powerActionsProcessed: PowerActionData[] = [];
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
    #playerDeck: CardData[] = [];
    #playerHand: CardData[] = [];
    #playerTrash: CardData[] = [];
    #playerBattleCardset: CardData[] = [];
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
    #opponentDeck: CardData[] = [];
    #opponentHand: CardData[] = [];
    #opponentTrash: CardData[] = [];
    #opponentBattleCardset: CardData[] = [];

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

    #setPlayerDeck(deck: CardData[]): void {
        this.#playerDeck = deck;
    }

    #setPlayerHand(hand: CardData[]): void {
        this.#playerHand = hand;
    }

    #setOpponentId(opponentId: string): void {
        this.#opponentId = opponentId;
    }

    #setOpponentStep(step: string): void {
        this.#opponentStep = step;
    }

    #setOpponentDeck(deck: CardData[]): void {
        this.#opponentDeck = deck;
    }

    #setOpponentHand(hand: CardData[]): void {
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

    getFoldersOptions(playerId: string): Promise<CommandOption[]> {
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
                    },
                    numCards: folder.deck.length
                }));
                const padValue = 16;
                const folderDescriptions = foldersData.map(folder => {
                    return {
                        id: folder.id,
                        name: folder.name.padEnd(padValue),
                        description: `${Object.entries(folder.colorsPoints).map(([color, points]) => `${color}: ${points.toString().padStart(2, "0")}`).join(', ')}`
                    };
                });
                const options = folderDescriptions.map(folder => ({
                    description: `${folder.name} ${folder.description}`,
                    onSelect: async () => { 
                        await this.setFolder(playerId, folder.id); 
                    },
                    disabled: false
                }));
                resolve(options);
            }, delayMock);
        });
    }

    setFolder(playerId: string, folderId: string): Promise<boolean> {
        return new Promise((resolve) => {
            const folderIndex = folders.findIndex((f) => f.id === folderId);
            const deck = ArrayUtil.clone(folders[folderIndex].deck || []);
            if (this.#isPlayer(playerId)) {
                this.#setPlayerDeck(deck);
                this.#setPlayerStep(SET_DECK);
                this.#playerBoard[DECK] = this.#playerDeck.length;
                //mock
                this.#setOpponentDeck(ArrayUtil.clone(redDeck));
                this.#setOpponentStep(SET_DECK);
                this.#opponentBoard[DECK] = this.#opponentDeck.length;
                // mock
            };
            if (this.#isOpponent(playerId)) {
                this.#setOpponentDeck(deck);
                this.#setOpponentStep(SET_DECK);
                this.#opponentBoard[DECK] = deck.length;
            };
            setTimeout(() => resolve(true), delayMock);
        });
    }

    #createCardByType(card: CardData): Card {
        return CardFactory.createByType(this.scene, card);
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
        this.#playerDeck = ArrayUtil.shuffle<CardData>(this.#playerDeck);
    }

    #drawPlayerCards(): void {
        const powerCards = this.#playerDeck.filter(card => card.type === POWER).slice(0, 3);
        const battleCards = this.#playerDeck.filter(card => card.type === BATTLE).slice(0, (6 - powerCards.length));
        const drawnCards = [...powerCards, ...battleCards];
        this.#playerDeck = this.#playerDeck.filter(card => !drawnCards.includes(card));
        this.#setPlayerHand(drawnCards);
    }

    #shuffleOpponentDeck(): void {
        this.#opponentDeck = ArrayUtil.shuffle<CardData>(this.#opponentDeck);
    }

    #drawOpponentCards(): void {
        const powerCards = this.#opponentDeck.filter(card => card.type === POWER).slice(0, 3);
        const battleCards = this.#opponentDeck.filter(card => card.type === BATTLE).slice(0, (6 - powerCards.length));
        const drawnCards = [...powerCards, ...battleCards];
        this.#opponentDeck = this.#opponentDeck.filter(card => !drawnCards.includes(card));
        this.#setOpponentHand(drawnCards);
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
            this.#playerBoard[RED] += this.#playerHand.filter(card => card.color === RED).length;
            this.#playerBoard[GREEN] += this.#playerHand.filter(card => card.color === GREEN).length;
            this.#playerBoard[BLUE] += this.#playerHand.filter(card => card.color === BLUE).length;
            this.#playerBoard[BLACK] += this.#playerHand.filter(card => card.color === BLACK).length;
            this.#playerBoard[WHITE] += this.#playerHand.filter(card => card.color === WHITE).length;
            this.#playerBoard[DECK] = this.#playerDeck.length;
            this.#playerBoard[HAND] = this.#playerHand.length;
            this.#playerBoard[TRASH] = this.#playerTrash.length;
            this.#setPlayerStep(WAITING_TO_PLAY);
        };
        if (this.#isOpponent(playerId)) {
            this.#opponentBoard[RED] += this.#opponentHand.filter(card => card.color === RED).length;
            this.#opponentBoard[GREEN] += this.#opponentHand.filter(card => card.color === GREEN).length;
            this.#opponentBoard[BLUE] += this.#opponentHand.filter(card => card.color === BLUE).length;
            this.#opponentBoard[BLACK] += this.#opponentHand.filter(card => card.color === BLACK).length;
            this.#opponentBoard[WHITE] += this.#opponentHand.filter(card => card.color === WHITE).length;
            this.#opponentBoard[DECK] = this.#opponentDeck.length;
            this.#opponentBoard[HAND] = this.#opponentHand.length;
            this.#opponentBoard[TRASH] = this.#opponentTrash.length;
            this.#setOpponentStep(WAITING_TO_PLAY);
        };
    }
    
    getBoard(playerId: string): Promise<BoardWindow> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const boardData = {
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
                    };
                    const board = BoardWindow.createBottom(this.scene, boardData, 0x3C64DE);
                    resolve(board);
                };
                if (this.#isOpponent(playerId)) {
                    const opponentBoardData = {
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
                    };
                    const board = BoardWindow.createTopReverse(this.scene, opponentBoardData, 0xDE3C5A);
                    resolve(board);
                };
            }, delayMock);
        });
    }
    
    getOpponentBoard(playerId: string): Promise<BoardWindow> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const opponentBoardData = {
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
                    };
                    const board = BoardWindow.createTopReverse(this.scene, opponentBoardData, 0xDE3C5A);
                    resolve(board);
                };
                if (this.#isOpponent(playerId)) {
                    const boardData = {
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
                    };
                    const board = BoardWindow.createBottom(this.scene, boardData, 0x3C64DE);
                    resolve(board);
                };
            }, delayMock);
        });
    }

    getCardsFromHand(playerId: string): Promise<Card[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const cards = this.#playerHand.map(card => this.#createCardByType(card))
                    cards.forEach(card => this.#enableCard(card));
                    resolve(cards);
                };
                if (this.#isOpponent(playerId)) {
                    const cards = this.#opponentHand.map(card => this.#createCardByType(card))
                    cards.forEach(card => this.#enableCard(card));
                    resolve(cards);
                };
            }, delayMock);
        });
    }

    #enableCard(card: Card): void {
        card.faceUp();
        card.enable();
    }

    getOpponentCardsFromHand(playerId: string): Promise<Card[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#opponentHand.map(card => this.#createCardByType(card)));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#playerHand.map(card => this.#createCardByType(card)));
                };
            }, delayMock);
        });
    }

    isStartPlaying(playerId: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.#powerActions = [];
                this.#powerActionsProcessed = [];
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
            setTimeout(async () => {
                if (this.#isPlayer(playerId)) {
                    this.#setPlayerStep(PASS);
                };
                if (this.#isOpponent(playerId)) {
                    this.#setOpponentStep(PASS);
                };
                if (await this.allPass() && this.#powerActions.length > 0) {
                    this.#processPowerCardPlays();
                }
                resolve();
            }, delayMock);
        });
    }

    getPowerCardById(playerId: string, cardId: string): Promise<PowerCard> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                if (this.#isPlayer(playerId)) {
                    const powerCardData = this.#playerHand.find(card => card.id === cardId && card.type === POWER) as CardData;
                    resolve(this.#createCardByType(powerCardData) as PowerCard);
                };
                if (this.#isOpponent(playerId)) {
                    const powerCardData = this.#opponentHand.find(card => card.id === cardId && card.type === POWER) as CardData;
                    resolve(this.#createCardByType(powerCardData) as PowerCard);
                };
            }, delayMock);
        });
    }

    getFieldPowerCards(): Promise<PowerCard[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const powerCards = [] as PowerCard[];
                this.#powerActions.forEach(action => {
                    powerCards.push(this.#createCardByType(action.powerCard) as PowerCard);
                });
                powerCards.forEach(card => this.#enableCard(card));
                resolve(powerCards);
            }, delayMock);
        });
    }

    makePowerCardPlay(playerId: string, powerAction: PowerActionData): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const powerCardId = powerAction.powerCard.id;
                this.#powerActions.push(powerAction);
                if (this.#isPlayer(playerId)) {
                    await this.#removePowerCardInHandById(this.#playerId, powerCardId);
                    this.#setPlayerStep(PASS);
                    this.#setOpponentStep(IN_PLAY);
                };
                if (this.#isOpponent(playerId)) {
                    await this.#removePowerCardInHandById(this.#opponentId, powerCardId);
                    this.#setOpponentStep(PASS);
                    this.#setPlayerStep(IN_PLAY);
                };
                if (await this.isPowerfieldLimitReached()) {
                    this.#processPowerCardPlays();
                }
                resolve();
            }, delayMock);
        });
    }

    #processPowerCardPlays(): void {
        const powerActions = this.#powerActions;
        powerActions.forEach(pa => {
            if (this.#isPlayer(pa.playerId)) {
                this.#playerTrash.push(pa.powerCard);
                this.#playerBoard[TRASH] = this.#playerTrash.length;
            };
            if (this.#isOpponent(pa.playerId)) {
                this.#opponentTrash.push(pa.powerCard);
                this.#opponentBoard[TRASH] = this.#opponentTrash.length;
            };
        });
        this.#powerActionsProcessed = ArrayUtil.clone(this.#powerActions);
        this.#setPlayerStep(PROCESS_POWER_CARDS);
        this.#setOpponentStep(PROCESS_POWER_CARDS);
        console.log('Processed power actions!');
    }

    #removePowerCardInHandById(playerId: string, powerCardId: string): Promise<void> {
        return new Promise((resolve) => {
            if (this.#isPlayer(playerId)) {
                this.#playerHand = this.#playerHand.filter((card) => card.id !== powerCardId);
            };
            if (this.#isOpponent(playerId)) {
                this.#opponentHand = this.#opponentHand.filter((card) => card.id !== powerCardId);
            };
            setTimeout(() => resolve(), delayMock);
        });
    }

    isPowerfieldLimitReached(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#powerActions.length >= 3);
            }, delayMock);
        });
    }

    hasPowerCardsInField(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#powerActionsProcessed.length > 0);
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

    listenOpponentPlay(playerId: string, callback: (play: PowerCardPlay) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                if (this.#isPlayer(playerId)) {
                    // mock
                    const powerCardData = this.#opponentHand.find(card => card.type === POWER) as CardData;
                    const powerCard = this.#createCardByType(powerCardData) as PowerCard;
                    if (counter <= 1 && powerCard) {
                        counter++;
                        const powerAction = { 
                            playerId: this.#opponentId,
                            powerCard: powerCard.staticData,
                            config: true
                        } as PowerActionData;
                        await this.makePowerCardPlay(this.#opponentId, powerAction);
                        callback({
                            pass: false,
                            powerAction: {
                                playerId: this.#opponentId,
                                powerCard,
                                config: true
                            }
                        });
                    } else {
                        await this.pass(this.#opponentId);
                        callback({
                            pass: true,
                            powerAction: null
                        });
                    }
                    // mock
                };
                if (this.#isOpponent(playerId)) {
                    // mock
                    await this.pass(this.#playerId);
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

    getPowerActions(): Promise<PowerAction[]> {
        return new Promise((resolve) => {
            const powerActions = this.#powerActionsProcessed.map(action => {
                const powerCardData = action.powerCard;
                const powerCard = this.#createCardByType(powerCardData) as PowerCard;
                return {
                    playerId: action.playerId,
                    powerCard,
                    config: action.config
                }
            });
            setTimeout(() => resolve(powerActions), delayMock);
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
                    const cards = this.#playerHand.filter(card => cardIds.includes(card.id)) as CardData[];
                    this.#removeBoardPointsByBattleCards(cards, this.#playerBoard);
                    this.#playerBattleCardset = cards;
                    this.#playerHand = this.#playerHand.filter(card => !cardIds.includes(card.id));
                    const battePoints = this.#getBattlePointsFromBattleCards(this.#playerId);
                    this.#playerBoard[AP] = battePoints[AP];
                    this.#playerBoard[HP] = battePoints[HP];
                    this.#setPlayerStep(BATTLE_CARDS_SET);
                }
                if (this.#isOpponent(playerId)) {
                    const cards = this.#opponentHand.filter(card => cardIds.includes(card.id)) as CardData[];
                    this.#removeBoardPointsByBattleCards(cards, this.#opponentBoard);
                    this.#opponentBattleCardset = cards;
                    this.#opponentHand = this.#opponentHand.filter(card => !cardIds.includes(card.id));
                    const battePoints = this.#getBattlePointsFromBattleCards(this.#opponentId);
                    this.#opponentBoard[AP] = battePoints[AP];
                    this.#opponentBoard[HP] = battePoints[HP];
                    this.#setOpponentStep(BATTLE_CARDS_SET);
                }
                resolve();
            }, delayMock);
        });
    }

    #removeBoardPointsByBattleCards(cards: CardData[], boardWindowData: BoardWindowData): void {
        cards.forEach(card => {
            switch (card.color) {
                case RED:
                    boardWindowData[RED] -= card.cost;
                    break;
                case GREEN:
                    boardWindowData[GREEN] -= card.cost;
                    break;
                case BLUE:
                    boardWindowData[BLUE] -= card.cost;
                    break;
                case BLACK:
                    boardWindowData[BLACK] -= card.cost;
                    break;
                case WHITE:
                    boardWindowData[WHITE] -= card.cost;
                    break;
                case ORANGE:
                    break;
            }
        });
    }

    #getBattlePointsFromBattleCards(playerId: string): BattlePoints {
        if (this.#isPlayer(playerId)) {
            const apTotal = this.#playerBattleCardset.reduce((sum, card) => sum + card.ap, 0);
            const hpTotal = this.#playerBattleCardset.reduce((sum, card) => sum + card.hp, 0);
            return { 
                [AP]: apTotal, 
                [HP]: hpTotal 
            };
        }
        if (this.#isOpponent(playerId)) {
            const apTotal = this.#opponentBattleCardset.reduce((sum, card) => sum + card.ap, 0);
            const hpTotal = this.#opponentBattleCardset.reduce((sum, card) => sum + card.hp, 0);
            return { 
                [AP]: apTotal, 
                [HP]: hpTotal 
            };
        }
        return { 
            [AP]: 0, 
            [HP]: 0 
        };
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
                    const battleCards = this.#opponentHand.filter((card: CardData) => {
                        if (card.type === POWER) return;
                        if (
                            card.type === BATTLE
                            && this.#hasEnoughPointsByColorAndCost(card.color, card.cost, boardOpponentClone)
                        ) {
                            this.#removeBoardPointsByBattleCards([card], boardOpponentClone);
                            return true;
                        }
                        return false;
                    });
                    const cardIds = battleCards.map(card => card.id);
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

    getBattleCards(playerId: string): Promise<BattleCard[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const cards = this.#playerBattleCardset.map(card => this.#createCardByType(card)) as BattleCard[];
                    cards.forEach(card => this.#enableCard(card));
                    resolve(cards);
                }
                if (this.#isOpponent(playerId)) {
                    const cards = this.#opponentBattleCardset.map(card => this.#createCardByType(card)) as BattleCard[];
                    cards.forEach(card => this.#enableCard(card));
                    resolve(cards);
                }
            }, delayMock);
        });
    }

    getOpponentBattleCards(playerId: string): Promise<BattleCard[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const cards = this.#opponentBattleCardset.map(card => this.#createCardByType(card)) as BattleCard[];
                    cards.forEach(card => this.#enableCard(card));
                    resolve(cards);
                }
                if (this.#isOpponent(playerId)) {
                    const cards = this.#playerBattleCardset.map(card => this.#createCardByType(card)) as BattleCard[];
                    cards.forEach(card => this.#enableCard(card));
                    resolve(cards);
                }
            }, delayMock);
        }); 
    }

    getBattlePointsFromBoard(playerId: string): Promise<BattlePoints> {
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

    getOpponentBattlePointsFromBoard(playerId: string): Promise<BattlePoints> {
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