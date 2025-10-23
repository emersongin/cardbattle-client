import { vi } from "vitest";
import { CardBattle } from "@game/api/CardBattle";
import { PowerActionData } from "@game/objects/PowerActionData";
import { NONE, PASS } from "@game/constants/keys";
import { CardData } from "@game/objects/CardData";
class CardBattleMock implements CardBattle {
    roomId: string = '';
    firstPlayer: string = '';
    powerActions = [] as PowerActionData[];
    powerActionsProcessed = [] as PowerActionData[];
    // player is the room creator
    playerId: string = '';
    playerStep = NONE;
    playerDeck: CardData[] = [];
    playerHand: CardData[] = [];
    // opponent is the one who joins the room
    opponentId: string = '';
    opponentStep = NONE;
    opponentDeck: CardData[] = [];
    opponentHand: CardData[] = [];
    createRoom = vi.fn();
    isOpponentJoined = vi.fn();
    listenOpponentJoined = vi.fn();
    joinRoom = vi.fn();
    getOpponentData = vi.fn();
    getFoldersOptions = vi.fn();
    setFolder = vi.fn();
    isOpponentDeckSet = vi.fn();
    listenOpponentDeckSet = vi.fn();
    isPlayMiniGame = vi.fn();
    setMiniGameChoice = vi.fn();
    listenOpponentEndMiniGame = vi.fn();
    isOpponentReadyDrawCards = vi.fn();
    setReadyDrawCards = vi.fn();
    listenOpponentDrawCards = vi.fn();
    getBoard = vi.fn();
    getOpponentBoard = vi.fn();
    getCardsFromHand = vi.fn();
    getOpponentCardsFromHand = vi.fn();
    isStartPlaying = vi.fn();
    setPlaying = vi.fn();
    pass = () => {
        this.playerStep = PASS;
        return Promise.resolve();
    };
    getPowerCardById = vi.fn();
    getFieldPowerCards = vi.fn();
    makePowerCardPlay = vi.fn();
    isPowerfieldLimitReached = vi.fn();
    hasPowerCardsInField = vi.fn();
    allPass = () => {
        return Promise.resolve(this.playerStep === PASS && this.opponentStep === PASS);
    };
    isOpponentPassed = vi.fn();
    listenOpponentPlay = vi.fn();
    hasPowerCardInHand = vi.fn();
    getPowerActions = vi.fn();
    setBattleCards = vi.fn();
    isOpponentBattleCardsSet = vi.fn();
    listenOpponentBattleCardsSet = vi.fn();
    getBattleCards = vi.fn();
    getOpponentBattleCards = vi.fn();
    getBattlePointsFromBoard = vi.fn();
    getOpponentBattlePointsFromBoard = vi.fn();
}

export default CardBattleMock;

// (playerId: string) => {
//         if (this.playerId === playerId) {
//             const powerCards = this.playerDeck.filter(card => card.type === POWER).slice(0, 4);
//             const battleCards = this.playerDeck.filter(card => card.type === BATTLE).slice(0, (6 - powerCards.length));
//             const drawnCards = [...powerCards, ...battleCards];
//             this.playerDeck = this.playerDeck.filter(card => !drawnCards.includes(card));
//             this.playerHand = drawnCards;
//         }
//         if (this.opponentId === playerId) {
//             const powerCards = this.opponentDeck.filter(card => card.type === POWER).slice(0, 4);
//             const battleCards = this.opponentDeck.filter(card => card.type === BATTLE).slice(0, (6 - powerCards.length));
//             const drawnCards = [...powerCards, ...battleCards];
//             this.opponentDeck = this.opponentDeck.filter(card => !drawnCards.includes(card));
//             this.opponentHand = drawnCards;
//         }
//         return Promise.resolve();
//     }

// ArrayUtil.clone(folders[2].deck || []);