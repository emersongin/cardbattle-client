import { CardType } from "@game/types/CardType";
import { CardColorType } from "../types/CardColorType";

export type CardData = {
    id: string;
    number: number;
    name: string;
    description: string;
    color: CardColorType;
    image: string;
    type: CardType;
    ap: number;
    hp: number;
    cost: number;
    effectType: string;
    effectDescription: string;
} 