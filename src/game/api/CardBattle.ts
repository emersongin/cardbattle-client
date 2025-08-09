import { BoardWindowData, CardData, CardsFolderData, OpponentData } from "../types";

export type LoadPhasePlay = {
    pass: boolean;
    powerCard: CardData | null;
}

export interface CardBattle {
    getOpponentData: () => Promise<OpponentData>;
    getFolders: () => Promise<CardsFolderData[]>;
    setFolder: (folderId: string) => Promise<boolean>;
    iGo: () => Promise<boolean>;
    listenOpponentStartPhase: (callback: (choice: string) => void) => Promise<void>;
    setPlayerChoice: (choice: string) => Promise<void>;
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
    playerMakePowerCardPlay: (powerCardId: string) => Promise<void>;
    isPowerfieldLimitReached: () => Promise<boolean>;
}