import { CardColorsType } from "@game/types/CardColorsType";
import { CardType } from "@game/types/CardType";

export type CardData = {
    id: string;
    number: number;
    name: string;
    description: string;
    details: string;
    color: CardColorsType;
    imageName: string;
    hp: number;
    ap: number;
    typeId: CardType;
    powerId: string;
    cost: number;
} 