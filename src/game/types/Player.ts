import { OPPONENT, PLAYER } from "../constants/keys";

export type Player = 
    | typeof PLAYER 
    | typeof OPPONENT;