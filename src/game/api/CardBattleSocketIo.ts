import { CardsFolder, Challenging } from '@game/types';
import { CardBattle } from './CardBattle';
import { io, Socket } from "socket.io-client";

export default class CardBattleSocketIo implements CardBattle {
    #socket: Socket;

    constructor() {
        this.#socket = io('http://localhost:3000');
    }

    getChallenging(timeout?: number): Promise<Challenging> {
        return new Promise((resolve, reject) => {
            this.#socket.emit('getChallenging', timeout, (response: Challenging) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('Failed to get challenging'));
                }
            });
        });
    }

    getFolders(timeout?: number): Promise<CardsFolder[]> {
        return new Promise((resolve, reject) => {
            this.#socket.emit('getFolders', timeout, (response: CardsFolder[]) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('Failed to get folders'));
                }
            });
        });
    }

    setFolder(folderId: string, timeout?: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this.#socket.emit('setFolder', folderId, timeout, (response: string) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('Failed to set folder'));
                }
            });
        });
    }

    iGo(timeout?: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.#socket.emit('iGo', timeout, (response: boolean) => {
                if (typeof response === 'boolean') {
                    resolve(response);
                } else {
                    reject(new Error('Failed to determine if I go'));
                }
            });
        });
    }
}