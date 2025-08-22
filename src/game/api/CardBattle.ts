import { BoardWindowData, CardData, CardsFolderData, OpponentData, PowerActionUpdates } from "../types";
import { PowerAction } from "../types/PowerAction";
import { RoomData } from "../types/RoomData";

export type LoadPhasePlay = {
    pass: boolean;
    powerAction: PowerAction | null;
}

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
    getHandCards: (playerId: string) => Promise<CardData[]>;
    getOpponentHandCards: (playerId: string) => Promise<CardData[]>;
    isStartPlaying: (playerId: string) => Promise<boolean>;
    setPlaying: (playerId: string) => Promise<void>;
    pass(playerId: string): Promise<void>;
    getPowerCardByIndex: (playerId: string, index: number) => Promise<CardData>;
    getFieldPowerCards: () => Promise<CardData[]>;
    makePowerCardPlay: (playerId: string, powerAction: PowerAction) => Promise<void>;
    isPowerfieldLimitReached: () => Promise<boolean>;
    hasPowerCardsInField: () => Promise<boolean>;
    allPass: () => Promise<boolean>;
    isOpponentPassed: (playerId: string) => Promise<boolean>;
    listenOpponentPlay: (playerId: string, callback: (play: LoadPhasePlay) => void) => Promise<void>;
    hasPowerCardInHand: (playerId: string) => Promise<boolean>;
    listenNextPowerCard: (playerId: string, callback: (powerAction: PowerAction, belongToPlayer: boolean) => void) => Promise<void>;
    setPowerActionCompleted: (playerId: string, powerCardId: string) => Promise<void>;
    hasPowerCardUpdates: (playerId: string) => Promise<boolean>;
    listenOpponentPowerActionUpdates: (playerId: string, callback: (isEnd: boolean) => void) => Promise<void>;
}