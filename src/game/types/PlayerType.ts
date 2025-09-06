import { OPPONENT, PLAYER } from "../constants/keys";

export type PlayerType = 
    | typeof PLAYER 
    | typeof OPPONENT;