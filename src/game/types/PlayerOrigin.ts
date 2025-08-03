import { OPPONENT, PLAYER } from "../constants/keys";

export type PlayerOrigin = 
    | typeof PLAYER 
    | typeof OPPONENT;