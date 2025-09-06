import { PowerActionData } from "@objects/PowerActionData";

export type PowerActionUpdatesData = {
    playerId: string;
    powerAction: PowerActionData;
    playerSincronized: boolean;
    opponentSincronized: boolean;
}