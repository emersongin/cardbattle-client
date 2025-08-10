import { PowerCardAction } from "./PowerCardAction";

export type PowerCardUpdates = {
    action: PowerCardAction;
    playerSincronized: boolean;
    opponentSincronized: boolean;
}