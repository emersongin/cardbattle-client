import { CardColorType } from "@game/types/CardColorType";
import { CardType } from "@game/types/CardType";

export type CardData = {
    id: string;
    number: number;
    name: string;
    description: string;
    color: CardColorType;
    image: string;
    type: CardType;
    // battle
    ap: number;
    hp: number;
    cost: number;
    // power
    effectType: string;
    effectDescription: string;
} 