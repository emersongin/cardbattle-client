import { BoardWindowData } from "@objects/BoardWindowData";
import { CardsFolderData } from "@objects/CardsFolderData";
import { OpponentData } from "@objects/OpponentData";
import { PowerActionData } from "@objects/PowerActionData";
import { PowerCardPlayData } from "@objects/PowerCardPlayData";
import { RoomData } from "@objects/RoomData";
import { BattlePointsData } from "../objects/BattlePointsData";
import { Card } from "../ui/Card/Card";
import { PowerCard } from "../ui/Card/PowerCard";
import { BattleCard } from "../ui/Card/BattleCard";

export interface CardBattle {
    createRoom: () => Promise<RoomData>;
    
    isOpponentJoined(playerId: string): Promise<boolean>;
    listenOpponentJoined: (playerId: string, callback: (isOpponentJoined?: boolean) => void) => Promise<void>;
    
    joinRoom: (roomId: string) => Promise<RoomData>;
    
    getOpponentData: (playerId: string, callback: (opponent: OpponentData) => void) => Promise<void>;

    getFolders: (playerId?: string) => Promise<CardsFolderData[]>;
    
    setFolder: (playerId: string, folderId: string) => Promise<boolean>;
    isOpponentDeckSet: (playerId: string) => Promise<boolean>;
    listenOpponentDeckSet: (playerId: string, callback: (isDeckSet?: boolean) => void) => Promise<void>;
    isPlayMiniGame: (playerId: string) => Promise<boolean>;
    setMiniGameChoice: (playerId: string, choice: string) => Promise<void>;
    listenOpponentEndMiniGame: (playerId: string, callback: (choice: string) => void) => Promise<void>;
    isOpponentReadyDrawCards: (playerId: string) => Promise<boolean>;
    setReadyDrawCards: (playerId: string) => Promise<void>;
    listenOpponentDrawCards(playerId: string, callback: (isReady: boolean) => void): Promise<void>;
    
    getBoard: (playerId: string) => Promise<BoardWindowData>;
    getOpponentBoard: (playerId: string) => Promise<BoardWindowData>;

    getCardsFromHand: (playerId: string) => Promise<Card[]>;
    getOpponentCardsFromHand: (playerId: string) => Promise<Card[]>;
    isStartPlaying: (playerId: string) => Promise<boolean>;
    setPlaying: (playerId: string) => Promise<void>;
    pass(playerId: string): Promise<void>;
    getPowerCardById: (playerId: string, cardId: string) => Promise<PowerCard>;
    getFieldPowerCards: () => Promise<PowerCard[]>;
    
    makePowerCardPlay: (playerId: string, powerAction: PowerActionData) => Promise<void>;
    isPowerfieldLimitReached: () => Promise<boolean>;
    hasPowerCardsInField: () => Promise<boolean>;
    allPass: () => Promise<boolean>;
    isOpponentPassed: (playerId: string) => Promise<boolean>;
    listenOpponentPlay: (playerId: string, callback: (play: PowerCardPlayData) => void) => Promise<void>;
    hasPowerCardInHand: (playerId: string) => Promise<boolean>;
    listenNextPowerCard: (playerId: string, callback: (powerAction: PowerActionData, belongToPlayer: boolean) => void) => Promise<void>;
    setPowerActionCompleted: (playerId: string, powerCardId: string) => Promise<void>;
    hasPowerCardUpdates: (playerId: string) => Promise<boolean>;
    listenOpponentPowerActionUpdates: (playerId: string, callback: (isEnd: boolean) => void) => Promise<void>;
    setBattleCards: (playerId: string, cardIds: string[]) => Promise<void>;
    isOpponentBattleCardsSet: (playerId: string) => Promise<boolean>;
    listenOpponentBattleCardsSet: (playerId: string, callback: (isSet: boolean) => void) => Promise<void>;
    getBattleCards: (playerId: string) => Promise<BattleCard[]>;
    getOpponentBattleCards: (playerId: string) => Promise<BattleCard[]>;
    
    getBattlePointsFromBoard: (playerId: string) => Promise<BattlePointsData>;
    getOpponentBattlePointsFromBoard: (playerId: string) => Promise<BattlePointsData>;
}