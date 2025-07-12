import { CardsFolder, Challenging } from '@game/types';
import { CardBattle } from './CardBattle';

export default class CardBattleSocketIo implements CardBattle {
    getChallenging(timeout?: number): Promise<Challenging> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 'challenge-1',
                    name: 'First Challenge',
                    description: 'Complete the first challenge to proceed.',
                    completed: false,
                    reward: 100,
                });
            }, timeout);
        });
    }

    getFolders(timeout?: number): Promise<CardsFolder[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'folder-1',
                        name: 'Folder 1',
                        colors: {
                            red: 50,
                            green: 30,
                            blue: 20,
                            black: 10,
                            white: 5,
                            orange: 15
                        },
                    },
                    {
                        id: 'folder-2',
                        name: 'Folder 2',
                        colors: {
                            red: 50,
                            green: 30,
                            blue: 20,
                            black: 10,
                            white: 5,
                            orange: 15
                        },
                    },
                    {
                        id: 'folder-3',
                        name: 'Folder 3',
                        colors: {
                            red: 50,
                            green: 30,
                            blue: 20,
                            black: 10,
                            white: 5,
                            orange: 15
                        },
                    }
                ]);
            }, timeout);
        });
    }

    setFolder(folderId: string, timeout?: number): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(folderId);
            }, timeout);
        });
    }

    iGo(timeout?: number): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.random() < 0.5);
            }, timeout);
        });
    }
}