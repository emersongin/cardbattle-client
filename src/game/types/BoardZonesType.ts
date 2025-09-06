import { DECK, HAND, TRASH, WINS } from "@/game/constants/keys";

export type BoardZonesType = 
    | typeof HAND 
    | typeof DECK
    | typeof TRASH
    | typeof WINS;