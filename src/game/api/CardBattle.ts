import { BoardWindowData, CardData, CardsFolderData, OpponentData, PowerCardUpdates } from "../types";
import { PowerCardAction } from "../types/PowerCardAction";
import { RoomData } from "../types/RoomData";

export type LoadPhasePlay = {
    pass: boolean;
    powerCard: CardData | null;
}

export interface CardBattle {
    createRoom: () => Promise<RoomData>;
    isOpponentJoined(): Promise<boolean>;
    listenOpponentJoined: (callback: (opponent: OpponentData) => void) => Promise<void>;
    joinRoom: (roomId: string) => Promise<RoomData>;
    
    
    
    
    getOpponentData: (callback: (opponent: OpponentData) => void) => Promise<void>;

    getFolders: () => Promise<CardsFolderData[]>;
    setFolder: (playerId: string, folderId: string) => Promise<boolean>;
    isStartMiniGame: (playerId: string) => Promise<boolean>;
    setMiniGameChoice: (playerId: string, choice: string) => Promise<void>;
    listenOpponentMiniGame: (callback: (choice: string) => void) => Promise<void>;
    getBoardData: (playerId: string) => Promise<BoardWindowData>;
    getOpponentBoardData: (playerId: string) => Promise<BoardWindowData>;
    isOpponentDrawCards: (playerId: string) => Promise<boolean>;
    listenWaitingForOpponentDrawCards: (playerId: string, callback: (isDrawCards: boolean) => void) => Promise<void>;
    drawCards: (playerId: string) => Promise<void>;
    getHandCardsData: (playerId: string) => Promise<CardData[]>;
    getOpponentHandCardsData: (playerId: string) => Promise<CardData[]>;

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