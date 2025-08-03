import { ColorsPoints } from "@/game/types";
import { CardsetEvents } from "./CardsetEvents";

export type SelectStateConfig = {
    events: CardsetEvents;
    colorPoints?: ColorsPoints | null;
    selectNumber?: number;
    startIndex?: number;
};