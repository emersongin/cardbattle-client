import { CardData } from "./CardData";

export type CardDataWithState = {
    faceUp: boolean;
    disabled: boolean;
} & CardData;