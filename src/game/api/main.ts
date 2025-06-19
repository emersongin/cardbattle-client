import { Api } from "../scenes/VueScene";
// import axios from 'axios';

const getChallenges = (timeout: number) => {
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

export default {
    getChallenges
} as Api;