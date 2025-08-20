import { PowerAction } from "./PowerAction";

export type PowerActionUpdates = {
    playerId: string;
    powerAction: PowerAction;
    playerSincronized: boolean;
    opponentSincronized: boolean;
}