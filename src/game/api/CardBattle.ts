import { BoardWindowData, CardData, CardsFolderData, OpponentData } from "../types";

export interface CardBattle {
    getOpponentData: () => Promise<OpponentData>;
    getFolders: () => Promise<CardsFolderData[]>;
    setFolder: (folderId: string, ) => Promise<string>;
    iGo: () => Promise<boolean>;
    listenOpponentChoice: (callback: (choice: string) => void) => Promise<void>;
    setOpponentChoice: (choice: string) => Promise<void>;
    drawPlayerCardsData: () => Promise<CardData[]>;
    drawOpponentCardsData: () => Promise<CardData[]>;
    getPlayerBoardData: () => Promise<BoardWindowData>;
    getOpponentBoardData: () => Promise<BoardWindowData>;
    getPlayerHandCardsData: () => Promise<CardData[]>;
    getOpponentHandCardsData: () => Promise<CardData[]>;
}