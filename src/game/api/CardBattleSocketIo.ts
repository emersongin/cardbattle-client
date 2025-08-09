import { BoardWindowData, CardData, CardsFolderData, OpponentData } from '../types';
import { CardBattle, LoadPhasePlay } from './CardBattle';
import { io, Socket } from "socket.io-client";

export default class CardBattleSocketIo implements CardBattle {
    #socket: Socket;

    constructor() {
        this.#socket = io('http://localhost:3000');
    }

    getOpponentData(timeout?: number): Promise<OpponentData> {
        return new Promise((resolve, reject) => {
            this.#socket.emit('getOpponentData', timeout, (response: OpponentData) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('Failed to get opponent data'));
                }
            });
        });
    }

    getFolders(timeout?: number): Promise<CardsFolderData[]> {
        return new Promise((resolve, reject) => {
            this.#socket.emit('getFolders', timeout, (response: CardsFolderData[]) => {
                if (response) {
                    resolve(response);
                } else {
                    reject(new Error('Failed to get folders'));
                }
            });
        });
    }

    setFolder(folderId: string, timeout?: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.#socket.emit('setFolder', folderId, timeout, (response: boolean) => {
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

    listenOpponentStartPhase(callback: (choice: string) => void): Promise<void> {
        return new Promise((resolve) => {
            this.#socket.on('setOpponentChoice', (choice: string) => {
                callback(choice);
            });
            resolve();
        });
    }

    setPlayerChoice(choice: string): Promise<void> {
        return new Promise((resolve) => {
            this.#socket.emit('setOpponentChoice', choice);
            resolve();
        });
    }

    drawPlayerCardsData(timeout?: number): Promise<CardData[]> {
        return new Promise((resolve) => {
            this.#socket.emit('drawPlayerCardsData', timeout, (response: CardData[]) => {
                resolve(response);
            });
        });
    }

    drawOpponentCardsData(timeout?: number): Promise<CardData[]> {
        return new Promise((resolve) => {
            this.#socket.emit('drawOpponentCardsData', timeout, (response: CardData[]) => {
                resolve(response);
            });
        });
    }

    getPlayerBoardData(timeout?: number): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            this.#socket.emit('getPlayerBoardData', timeout, (response: BoardWindowData) => {
                resolve(response);
            });
        });
    }

    getOpponentBoardData(timeout?: number): Promise<BoardWindowData> {
        return new Promise((resolve) => {
            this.#socket.emit('getOpponentBoardData', timeout, (response: BoardWindowData) => {
                resolve(response);
            });
        });
    }

    getPlayerHandCardsData(timeout?: number): Promise<CardData[]> {
        return new Promise((resolve) => {
            this.#socket.emit('getPlayerHandCardsData', timeout, (response: CardData[]) => {
                resolve(response);
            });
        });
    }

    getOpponentHandCardsData(timeout?: number): Promise<CardData[]> {
        return new Promise((resolve) => {
            this.#socket.emit('getOpponentHandCardsData', timeout, (response: CardData[]) => {
                resolve(response);
            });
        });
    }

    listenOpponentLoadPhase(callback: (play: LoadPhasePlay) => void): Promise<void> {
        return new Promise((resolve) => {
            this.#socket.on('opponentLoadPhase', (play: LoadPhasePlay) => {
                callback(play);
            });
            resolve();
        });
    }

    allPass(): Promise<boolean> {
        return new Promise((resolve) => {
            this.#socket.emit('allPass', (response: boolean) => {
                resolve(response);
            });
        });
    }

    isOpponentPassed(): Promise<boolean> {
        return new Promise((resolve) => {
            this.#socket.emit('opponentPassed', (response: boolean) => {
                resolve(response);
            });
        });
    }

    playerPass(): Promise<void> {
        return new Promise((resolve) => {
            this.#socket.emit('playerPass', () => {
                resolve();
            });
        });
    }

    hasPowerCardsInField(): Promise<boolean> {
        return new Promise((resolve) => {
            this.#socket.emit('hasPowerCardsInField', (response: boolean) => {
                resolve(response);
            });
        });
    }

    getPowerCardsData(): Promise<CardData[]> {
        return new Promise((resolve) => {
            this.#socket.emit('getPowerCardsData', (response: CardData[]) => {
                resolve(response);
            });
        });
    }

    getPlayerPowerCardByIndex(index: number): Promise<CardData> {
        return new Promise((resolve) => {
            this.#socket.emit('getPlayerPowerCardByIndex', index, (response: CardData) => {
                resolve(response);
            });
        });
    }

    playerMakePowerCardPlay(powerCardId: string): Promise<void> {
        return new Promise((resolve) => {
            this.#socket.emit('playerMakePowerCardPlay', powerCardId, () => {
                resolve();
            });
        });
    }

    isPowerfieldLimitReached(): Promise<boolean> {
        return new Promise((resolve) => {
            this.#socket.emit('isPowerfieldLimitReached', (response: boolean) => {
                resolve(response);
            });
        });
    }
}