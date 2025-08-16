import { BoardWindowData, CardData, CardsFolderData, OpponentData, PowerCardUpdates } from "../types";
import { PowerCardAction } from "../types/PowerCardAction";
import { RoomData } from "../types/RoomData";

export type LoadPhasePlay = {
    pass: boolean;
    powerCard: CardData | null;
}

export interface CardBattle {
    createRoom: () => Promise<RoomData>;
    isOpponentJoined(playerId: string): Promise<boolean>;
    listenOpponentJoined: (playerId: string, callback: (opponent: OpponentData) => void) => Promise<void>;
    joinRoom: (roomId: string) => Promise<RoomData>;
    getOpponentData: (playerId: string, callback: (opponent: OpponentData) => void) => Promise<void>;
    getFolders: () => Promise<CardsFolderData[]>;
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
    getHandCards: (playerId: string) => Promise<CardData[]>;
    getOpponentHandCards: (playerId: string) => Promise<CardData[]>;
    
    
    isGoFirst: () => Promise<boolean>;
    listenOpponentLoadPhase: (callback: (play: LoadPhasePlay) => void) => Promise<void>;
    allPass: () => Promise<boolean>;
    isOpponentPassed: () => Promise<boolean>;
    playerPass(): Promise<void>;
    hasPowerCardsInField: () => Promise<boolean>;
    getPowerCardsData: () => Promise<CardData[]>;
    getPlayerPowerCardByIndex: (index: number) => Promise<CardData>;
    playerMakePowerCardPlay: (powerAction: PowerCardAction) => Promise<void>;
    isPowerfieldLimitReached: () => Promise<boolean>;
    listenNextPowerCard: (callback: (playerId: string) => void) => Promise<PowerCardUpdates>;
    setPowerActionCompleted: (playerId: string, powerCardId: string) => Promise<void>;
}