import { CardsFolder, Opponent } from '@game/types';

export interface CardBattle {
    getOpponentData: (timeout?: number) => Promise<Opponent>;
    getFolders: (timeout?: number) => Promise<CardsFolder[]>;
    setFolder: (folderId: string, timeout?: number) => Promise<string>;
    iGo: (timeout?: number) => Promise<boolean>;
    listenOpponentChoice: (callback: (choice: string) => void) => Promise<void>;
    setOpponentChoice: (choice: string) => Promise<void>;
}