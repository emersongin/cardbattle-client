import { CardColorsType } from "@game/types/CardColorsType";
import { CardType } from "@game/types/CardType";

export type CardData = {
    id: string;
    number: number;
    name: string;
    description: string;
    color: CardColorsType;
    imageName: string;
    typeId: CardType;
    // battle card
    hp: number;
    ap: number;
    cost: number;
    // power card
    powerId: string;
    details: string;
} 