import { CardsFolder, Opponent } from '@game/types';
import { CardBattle } from './CardBattle';

export default class CardBattleSocketIo implements CardBattle {
    getOpponentData(): Promise<Opponent> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: 'opponent-1',
                    name: 'First Opponent',
                    description: 'Complete the first opponent to proceed.',
                    completed: false,
                    reward: 100,
                });
            }, 100);
        });
    }

    getFolders(): Promise<CardsFolder[]> {
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
            }, 1000);
        });
    }

    setFolder(folderId: string): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(folderId);
            }, 1000);
        });
    }

    iGo(): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(Math.random() < 0.5);
            }, 1000);
        });
    }

    listenOpponentChoice(callback: (choice: string) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const choice = Math.random() < 0.5 ? 'White' : 'Black';
                callback(choice);
                resolve();
            }, 1000);
        });
    }

    setOpponentChoice(choice: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Opponent choice set to: ${choice}`);
                resolve();
            }, 1000);
        });
    }
}