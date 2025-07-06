import { CardColors, CardType } from "./Card/Card";

export type CardData = {
    UUID: string;
    number: number;
    name: string;
    description: string;
    color: CardColors;
    imageName: string;
    hp: number;
    ap: number;
    typeId: CardType;
    powerId: string;
    cost: number;
} 