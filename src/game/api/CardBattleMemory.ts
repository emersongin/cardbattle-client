import { v4 as uuidv4 } from 'uuid';
import { CardBattle } from '@api/CardBattle';
import { BATTLE, BATTLE_CARDS_SET, DRAW_CARDS, END_MINI_GAME, IN_LOBBY, IN_PLAY, PASS, POWER, SET_DECK, WAITING_TO_PLAY } from '@constants/keys';
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from '@constants/colors';
import { BoardWindowData } from "@objects/BoardWindowData";
import { CardData } from "@objects/CardData";
import { CardsFolderData } from "@objects/CardsFolderData";
import { OpponentData } from "@objects/OpponentData";
import { PowerActionData } from "@objects/PowerActionData";
import { PowerCardPlayData } from "@objects/PowerCardPlayData";
import { RoomData } from "@objects/RoomData";
import { PowerActionUpdatesData } from '@objects/PowerActionUpdatesData';
import { CardColorsType } from '@game/types/CardColorsType';
import { CardType } from '@game/types/CardType';
import { ArrayUtil } from '@utils/ArrayUtil';
import { MathUtil } from '@utils/MathUtil';

const delayMock = 100;

const battleCards = [
    {
        id: 'B1',
        number: 1,
        name: 'Battle Card n° 1',
        description: 'This is a battle card description.',
        details: 'This card is used for battle purposes.',
        color: RED as CardColorsType,
        imageName: 'card-picture',
        hp: 5,
        ap: 5,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 2,
        disabled: false
    },
    {
        id: 'B2',
        number: 2,
        name: 'Battle Card n° 2',
        description: 'This is another battle card description.',
        details: 'This card is used for battle purposes.',
        color: GREEN as CardColorsType,
        imageName: 'card-picture',
        hp: 6,
        ap: 4,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 2,
        disabled: false
    },
    {
        id: 'B3',
        number: 3,
        name: 'Battle Card n° 3',
        description: 'This is yet another battle card description.',
        details: 'This card is used for battle purposes.',
        color: BLUE as CardColorsType,
        imageName: 'card-picture',
        hp: 4,
        ap: 6,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 2,
        disabled: false
    },
    {
        id: 'B4',
        number: 4,
        name: 'Battle Card n° 4',
        description: 'This is a different battle card description.',
        details: 'This card is used for battle purposes.',
        color: BLACK as CardColorsType,
        imageName: 'card-picture',
        hp: 7,
        ap: 3,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 2,
        disabled: false
    },
    {
        id: 'B5',
        number: 5,
        name: 'Battle Card n° 5',
        description: 'This is a unique battle card description.',
        details: 'This card is used for battle purposes.',
        color: WHITE as CardColorsType,
        imageName: 'card-picture',
        hp: 3,
        ap: 7,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 2,
        disabled: false
    },
    {
        id: 'B6',
        number: 6,
        name: 'Battle Card n° 6',
        description: 'This is a special battle card description.',
        details: 'This card is used for battle purposes.',
        color: ORANGE as CardColorsType,
        imageName: 'card-picture',
        hp: 8,
        ap: 2,
        typeId: BATTLE as CardType,
        powerId: 'none',
        cost: 0,
        disabled: false
    }
];

const powerCards = [
    {
        id: 'P1',
        number: 7,
        name: 'Power Card n° 1',
        description: 'This is a test power card description.',
        details: 'This card is used for testing power effects.',
        color: RED as CardColorsType,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-1',
        cost: 1,
        disabled: false
    },
    {
        id: 'P2',
        number: 8,
        name: 'Power Card n° 2',
        description: 'This is another test power card description.',
        details: 'This card is used for testing power effects.',
        color: GREEN as CardColorsType,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-2',
        cost: 1,
        disabled: false
    },
    {
        id: 'P3',
        number: 9,
        name: 'Power Card n° 3',
        description: 'This is yet another test power card description.',
        details: 'This card is used for testing power effects.',
        color: BLUE as CardColorsType,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-3',
        cost: 1,
        disabled: false
    },
    {
        id: 'P4',
        number: 10,
        name: 'Power Card n° 4',
        description: 'This is a different test power card description.',
        details: 'This card is used for testing power effects.',
        color: BLACK as CardColorsType,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-4',
        cost: 1,
        disabled: false
    },
    {
        id: 'P5',
        number: 11,
        name: 'Power Card n° 5',
        description: 'This is a unique test power card description.',
        details: 'This card is used for testing power effects.',
        color: WHITE as CardColorsType,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-5',
        cost: 1,
        disabled: false
    },
    {
        id: 'P6',
        number: 12,
        name: 'Power Card n° 6',
        description: 'This is a special test power card description.',
        details: 'This card is used for testing power effects.',
        color: ORANGE as CardColorsType,
        imageName: 'card-picture',
        hp: 0,
        ap: 0,
        typeId: POWER as CardType,
        powerId: 'power-6',
        cost: 1,
        disabled: false
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
        ap: 0,
        hp: 0,
        redPoints: 0,
        greenPoints: 0,
        bluePoints: 0,
        blackPoints: 0,
        whitePoints: 0,
        numberOfCardsInHand: 0,
        numberOfCardsInDeck: 0,
        numberOfCardsInTrash: 0,
        numberOfWins: 0,
        pass: false,
    };
    #playerDeck: CardData[] = [];
    #playerHand: CardData[] = [];
    #playerTrash: CardData[] = [];
    #playerBattleCardsSet: CardData[] = [];
    // opponent is the one who joins the room
    #opponentId: string = '';
    #opponentStep: string = 'NONE';
    #opponentBoard: BoardWindowData = {
        ap: 0,
        hp: 0,
        redPoints: 0,
        greenPoints: 0,
        bluePoints: 0,
        blackPoints: 0,
        whitePoints: 0,
        numberOfCardsInHand: 0,
        numberOfCardsInDeck: 0,
        numberOfCardsInTrash: 0,
        numberOfWins: 0,
        pass: false,
    };
    #opponentDeck: CardData[] = [];
    #opponentHand: CardData[] = [];
    #opponentTrash: CardData[] = [];
    #opponentBattleCardsSet: CardData[] = [];

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
                this.#setPlayerDeck(deck);
                this.#setPlayerStep(SET_DECK);
                this.#playerBoard.numberOfCardsInDeck = this.#playerDeck.length;
                //mock
                this.#setOpponentDeck(ArrayUtil.clone(redDeck));
                this.#setOpponentStep(SET_DECK);
                this.#opponentBoard.numberOfCardsInDeck = this.#opponentDeck.length;
                // mock
            };
            if (this.#isOpponent(playerId)) {
                this.#setOpponentDeck(deck);
                this.#setOpponentStep(SET_DECK);
                this.#opponentBoard.numberOfCardsInDeck = deck.length;
            };
            setTimeout(() => resolve(true), delayMock);
        });
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
            this.#playerBoard.redPoints += this.#playerHand.filter(card => card.color === RED).length;
            this.#playerBoard.greenPoints += this.#playerHand.filter(card => card.color === GREEN).length;
            this.#playerBoard.bluePoints += this.#playerHand.filter(card => card.color === BLUE).length;
            this.#playerBoard.blackPoints += this.#playerHand.filter(card => card.color === BLACK).length;
            this.#playerBoard.whitePoints += this.#playerHand.filter(card => card.color === WHITE).length;
            this.#playerBoard.numberOfCardsInDeck = this.#playerDeck.length;
            this.#playerBoard.numberOfCardsInHand = this.#playerHand.length;
            this.#setPlayerStep(WAITING_TO_PLAY);
        };
        if (this.#isOpponent(playerId)) {
            this.#opponentBoard.redPoints += this.#opponentHand.filter(card => card.color === RED).length;
            this.#opponentBoard.greenPoints += this.#opponentHand.filter(card => card.color === GREEN).length;
            this.#opponentBoard.bluePoints += this.#opponentHand.filter(card => card.color === BLUE).length;
            this.#opponentBoard.blackPoints += this.#opponentHand.filter(card => card.color === BLACK).length;
            this.#opponentBoard.whitePoints += this.#opponentHand.filter(card => card.color === WHITE).length;
            this.#opponentBoard.numberOfCardsInDeck = this.#opponentDeck.length;
            this.#opponentBoard.numberOfCardsInHand = this.#opponentHand.length;
            this.#setOpponentStep(WAITING_TO_PLAY);
        };
    }
    
    getBoard(playerId: string): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve({
                        ap: this.#playerBoard.ap,
                        hp: this.#playerBoard.hp,
                        redPoints: this.#playerBoard.redPoints,
                        greenPoints: this.#playerBoard.greenPoints,
                        bluePoints: this.#playerBoard.bluePoints,
                        blackPoints: this.#playerBoard.blackPoints,
                        whitePoints: this.#playerBoard.whitePoints,
                        numberOfCardsInHand: this.#playerBoard.numberOfCardsInHand,
                        numberOfCardsInDeck: this.#playerBoard.numberOfCardsInDeck,
                        numberOfCardsInTrash: this.#playerBoard.numberOfCardsInTrash,
                        numberOfWins: this.#playerBoard.numberOfWins,
                        pass: this.#playerBoard.pass
                    });
                };
                if (this.#isOpponent(playerId)) {
                    resolve({
                        ap: this.#opponentBoard.ap,
                        hp: this.#opponentBoard.hp,
                        redPoints: this.#opponentBoard.redPoints,
                        greenPoints: this.#opponentBoard.greenPoints,
                        bluePoints: this.#opponentBoard.bluePoints,
                        blackPoints: this.#opponentBoard.blackPoints,
                        whitePoints: this.#opponentBoard.whitePoints,
                        numberOfCardsInHand: this.#opponentBoard.numberOfCardsInHand,
                        numberOfCardsInDeck: this.#opponentBoard.numberOfCardsInDeck,
                        numberOfCardsInTrash: this.#opponentBoard.numberOfCardsInTrash,
                        numberOfWins: this.#opponentBoard.numberOfWins,
                        pass: this.#opponentBoard.pass
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
                        ap: this.#opponentBoard.ap,
                        hp: this.#opponentBoard.hp,
                        redPoints: this.#opponentBoard.redPoints,
                        greenPoints: this.#opponentBoard.greenPoints,
                        bluePoints: this.#opponentBoard.bluePoints,
                        blackPoints: this.#opponentBoard.blackPoints,
                        whitePoints: this.#opponentBoard.whitePoints,
                        numberOfCardsInHand: this.#opponentBoard.numberOfCardsInHand,
                        numberOfCardsInDeck: this.#opponentBoard.numberOfCardsInDeck,
                        numberOfCardsInTrash: this.#opponentBoard.numberOfCardsInTrash,
                        numberOfWins: this.#opponentBoard.numberOfWins,
                        pass: this.#opponentBoard.pass
                    });
                };
                if (this.#isOpponent(playerId)) {
                    resolve({
                        ap: this.#playerBoard.ap,
                        hp: this.#playerBoard.hp,
                        redPoints: this.#playerBoard.redPoints,
                        greenPoints: this.#playerBoard.greenPoints,
                        bluePoints: this.#playerBoard.bluePoints,
                        blackPoints: this.#playerBoard.blackPoints,
                        whitePoints: this.#playerBoard.whitePoints,
                        numberOfCardsInHand: this.#playerBoard.numberOfCardsInHand,
                        numberOfCardsInDeck: this.#playerBoard.numberOfCardsInDeck,
                        numberOfCardsInTrash: this.#playerBoard.numberOfCardsInTrash,
                        numberOfWins: this.#playerBoard.numberOfWins,
                        pass: this.#playerBoard.pass
                    });
                };
            }, delayMock);
        });
    }

    getCardsFromHand(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#playerHand);
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentHand);
                };
            }, delayMock);
        });
    }

    getOpponentCardsFromHand(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#opponentHand);
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#playerHand);
                };
            }, delayMock);
        });
    }

    getCardsFromHandInTheLoadPhase(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const battleCards = this.#playerHand.filter(card => card.typeId === BATTLE);
                    const battleCardsDisabled = battleCards.map(card => ({ ...card, disabled: true }));
                    const powerCards = this.#playerHand.filter(card => card.typeId === POWER);
                    resolve(ArrayUtil.shuffle([...battleCardsDisabled, ...powerCards]));
                };
                if (this.#isOpponent(playerId)) {
                    const battleCards = this.#playerHand.filter(card => card.typeId === BATTLE);
                    const battleCardsDisabled = battleCards.map(card => ({ ...card, disabled: true }));
                    const powerCards = this.#playerHand.filter(card => card.typeId === POWER);
                    resolve(ArrayUtil.shuffle([...battleCardsDisabled, ...powerCards]));
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

    getPowerCardById(playerId: string, cardId: string): Promise<CardData> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#playerHand.find(card => card.id === cardId && card.typeId === POWER) as CardData);
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentHand.find(card => card.id === cardId && card.typeId === POWER) as CardData);
                };
            }, delayMock);
        });
    }

    getFieldPowerCards(): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.#powerActionUpdates.map((update) => update.powerAction.powerCard));
            }, delayMock);
        });
    }

    makePowerCardPlay(playerId: string, powerAction: PowerActionData): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(async () => {
                const powerCardId = powerAction.powerCard.id;
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
                    const powerCard = this.#opponentHand.find(card => card.typeId === POWER);
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
                    resolve(this.#playerHand.some(card => card.typeId === POWER));
                };
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentHand.some(card => card.typeId === POWER));
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
                    const update = this.#powerActionUpdates.find(update => update.powerAction.powerCard.id === powerCardId);
                    if (update) update.playerSincronized = true;
                    // mock
                    if (update) update.opponentSincronized = true;
                };
                if (this.#isOpponent(playerId)) {
                    const update = this.#powerActionUpdates.find(update => update.powerAction.powerCard.id === powerCardId);
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
                    return;
                };
                if (this.#isOpponent(update.playerId)) {
                    this.#opponentTrash.push(update.powerAction.powerCard);
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

    getCardsFromHandInTheSummonPhase(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const battleCards = this.#playerHand.filter(card => card.typeId === BATTLE);
                    const battleCardsDisabled = battleCards.map(card => ({ ...card, disabled: !this.#hasEnoughPointsByColorAndCost(card.color, card.cost, this.#playerBoard) }));
                    const powerCards = this.#playerHand.filter(card => card.typeId === POWER);
                    const powerCardsDisabled = powerCards.map(card => ({ ...card, disabled: true }));
                    resolve(ArrayUtil.shuffle([...powerCardsDisabled, ...battleCardsDisabled]));
                };
                if (this.#isOpponent(playerId)) {
                    const battleCards = this.#playerHand.filter(card => card.typeId === BATTLE);
                    const battleCardsDisabled = battleCards.map(card => ({ ...card, disabled: !this.#hasEnoughPointsByColorAndCost(card.color, card.cost, this.#opponentBoard) }));
                    const powerCards = this.#playerHand.filter(card => card.typeId === POWER);
                    const powerCardsDisabled = powerCards.map(card => ({ ...card, disabled: true }));
                    resolve(ArrayUtil.shuffle([...powerCardsDisabled, ...battleCardsDisabled]));
                };
            }, delayMock);
        });
    }

    #hasEnoughPointsByColorAndCost(cardColor: CardColorsType, cardCost: number, boardWindowData: BoardWindowData): boolean {
        if (cardColor === ORANGE) return true;
        switch (cardColor) {
            case RED:
                return boardWindowData.redPoints >= cardCost;
            case GREEN:
                return boardWindowData.greenPoints >= cardCost;
            case BLUE:
                return boardWindowData.bluePoints >= cardCost;
            case BLACK:
                return boardWindowData.blackPoints >= cardCost;
            case WHITE:
                return boardWindowData.whitePoints >= cardCost;
            default:
                return true;
        }
    }

    setBattleCards(playerId: string, cardIds: string[]): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    const cards = this.#playerHand.filter(card => cardIds.includes(card.id) && card.typeId === BATTLE);
                    this.#playerBattleCardsSet = cards;
                    this.#playerHand = this.#playerHand.filter(card => !cardIds.includes(card.id));
                    this;this.#setPlayerStep(BATTLE_CARDS_SET);
                    // mock
                    // this.#setOpponentStep(BATTLE_CARDS_SET);
                    // const opponentCardIds = this.#opponentHand.filter(c => c.typeId === BATTLE).map(c => c.id);
                    // this.setBattleCards(this.#opponentId, opponentCardIds);
                    // mock
                };
                // if (this.#isOpponent(playerId)) {
                //     const cards = this.#opponentHand.filter(card => cardIds.includes(card.id) && card.typeId === BATTLE);
                //     this.#opponentBattleCardsSet = cards;
                //     this.#opponentHand = this.#opponentHand.filter(card => !cardIds.includes(card.id));
                //     this.#setOpponentStep(BATTLE_CARDS_SET);
                // };
                resolve();
            }, delayMock);
        });
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
                    this.#setOpponentStep(BATTLE_CARDS_SET);
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

    getBattleCards(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#playerBattleCardsSet);
                }
                if (this.#isOpponent(playerId)) {
                    resolve(this.#opponentBattleCardsSet);
                }
            }, delayMock);
        });
    }

    getOpponentBattleCards(playerId: string): Promise<CardData[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.#isPlayer(playerId)) {
                    resolve(this.#opponentBattleCardsSet);
                }
                if (this.#isOpponent(playerId)) {
                    resolve(this.#playerBattleCardsSet);
                }
            }, delayMock);
        }); 
    }

}