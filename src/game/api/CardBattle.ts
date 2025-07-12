import { CardsFolder, Challenging } from '@game/types';

export interface CardBattle {
    getChallenging: (timeout?: number) => Promise<Challenging>;
    getFolders: (timeout?: number) => Promise<CardsFolder[]>;
    setFolder: (folderId: string, timeout?: number) => Promise<string>;
    iGo: (timeout?: number) => Promise<boolean>;
}