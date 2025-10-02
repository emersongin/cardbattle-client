import { CardData } from "./CardData";

export type PowerCardData = {
    effectType: string;
    effectDescription: string;
} & CardData;