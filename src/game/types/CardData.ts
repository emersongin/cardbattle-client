import { CardColors, CardType } from "../ui/Card/Card";

export type CardData = {
    UUID: string;
    number: number;
    name: string;
    description: string;
    details: string;
    color: CardColors;
    imageName: string;
    hp: number;
    ap: number;
    typeId: CardType;
    powerId: string;
    cost: number;
} 