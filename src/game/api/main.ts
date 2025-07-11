import { Api } from "../scenes/VueScene";
import { ColorsPoints } from "../ui/ColorsPoints";
// import axios from 'axios';

export type Challenging = {
    id: string;
    name: string;
    description: string;
    completed: boolean;
    reward: number;
};

export type Folder = {
    id: string;
    name: string;
    colors: ColorsPoints;
};

const getChallenges = (timeout: number = 1000): Promise<Challenging> => {
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
};

const getFolders = (timeout: number = 1000): Promise<Folder[]> => {
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
                    id: 'folder-folder-2',
                    name: 'Folder 22',
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
                    id: 'folder-folder-folder-3',
                    name: 'Folder 333',
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
};

const setFolder = (folderId: string, timeout: number = 1000): Promise<string> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`Folder set to: ${folderId}`);
            resolve(folderId);
        }, timeout);
    });
};

const iGo = (timeout: number = 1000): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Math.random() < 0.5);
        }, timeout);
    });
};

export default {
    getChallenges,
    getFolders,
    setFolder,
    iGo,
} as Api;