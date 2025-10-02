import { CardData } from "./CardData";

export type BattleCardData = {
    ap: number;
    hp: number;
    cost: number;
} & CardData;