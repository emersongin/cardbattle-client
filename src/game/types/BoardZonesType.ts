import { DECK, HAND, TRASH, WINS } from "@constants/keys";

export type BoardZonesType = 
    | typeof HAND 
    | typeof DECK
    | typeof TRASH
    | typeof WINS;