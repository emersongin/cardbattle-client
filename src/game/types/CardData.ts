import { CardColors } from "../ui/Card/types/CardColors";
import { CardType } from "../ui/Card/types/CardType";

export type CardData = {
    id: string;
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