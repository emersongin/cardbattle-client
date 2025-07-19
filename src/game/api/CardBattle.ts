import { CardsFolderData, Opponent } from '@game/types';
import { CardData } from '../ui/types/CardData';
import { BoardWindowData } from '../ui/BoardWindow/BoardWindow';

export interface CardBattle {
    getOpponentData: (timeout?: number) => Promise<Opponent>;
    getFolders: (timeout?: number) => Promise<CardsFolderData[]>;
    setFolder: (folderId: string, timeout?: number) => Promise<string>;
    iGo: (timeout?: number) => Promise<boolean>;
    listenOpponentChoice: (callback: (choice: string) => void) => Promise<void>;
    setOpponentChoice: (choice: string) => Promise<void>;
    drawPlayerCardsData: (timeout?: number) => Promise<CardData[]>;
    drawOpponentCardsData: (timeout?: number) => Promise<CardData[]>;
    getPlayerBoardData: (timeout?: number) => Promise<BoardWindowData>;
    getOpponentBoardData: (timeout?: number) => Promise<BoardWindowData>;
}