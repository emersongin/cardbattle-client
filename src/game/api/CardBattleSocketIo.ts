import { CardsFolder, Challenging } from '@game/types';
import { CardBattle } from './CardBattle';
import { io, Socket } from "socket.io-client";

export default class CardBattleSocketIo implements CardBattle {
    getChallenging(timeout?: number): Promise<Challenging>;
    getFolders(timeout?: number): Promise<CardsFolder[]>;
    setFolder(folderId: string, timeout?: number): Promise<string>;
    iGo(timeout?: number): Promise<boolean>;
}