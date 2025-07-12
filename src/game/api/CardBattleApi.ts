import { CardsFolder, Challenging } from '@game/types';

export interface CardBattleApi {
    getChallenges: (timeout?: number) => Promise<Challenging>;
    getFolders: (timeout?: number) => Promise<CardsFolder[]>;
    setFolder: (folderId: string, timeout?: number) => Promise<string>;
    iGo: (timeout?: number) => Promise<boolean>;
}