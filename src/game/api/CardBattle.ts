import { BoardWindowData, CardData, CardsFolderData, OpponentData, PowerCardUpdates } from "../types";
import { PowerCardAction } from "../types/PowerCardAction";
import { RoomData } from "../types/RoomData";

export type LoadPhasePlay = {
    pass: boolean;
    powerCard: CardData | null;
}

export interface CardBattle {
    createRoom: () => Promise<RoomData>;
    joinRoom: (roomId: string) => Promise<RoomData>;
    isOpponentJoined(): Promise<boolean>;
    getOpponentData: (callback: (opponent: OpponentData) => void) => Promise<void>;
    listenWaitingForOpponentData: (callback: (opponent: OpponentData) => void) => Promise<void>;
    getFolders: () => Promise<CardsFolderData[]>;
    setFolder: (playerId: string, folderId: string) => Promise<boolean>;
    isStartMiniGame: (playerId: string) => Promise<boolean>;
    setMiniGameChoice: (playerId: string, choice: string) => Promise<void>;
    listenOpponentMiniGame: (callback: (choice: string) => void) => Promise<void>;

    iGo: () => Promise<boolean>;
    drawPlayerCardsData: () => Promise<CardData[]>;
    drawOpponentCardsData: () => Promise<CardData[]>;
    getPlayerBoardData: () => Promise<BoardWindowData>;
    getOpponentBoardData: () => Promise<BoardWindowData>;
    getPlayerHandCardsData: () => Promise<CardData[]>;
    getOpponentHandCardsData: () => Promise<CardData[]>;
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