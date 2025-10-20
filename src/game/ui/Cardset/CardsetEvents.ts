import { Card } from "@ui/Card//Card";
import { BattleCard } from "@ui/Card//BattleCard";

export type CardsetEvents = {
    onChangeIndex?: (card: Card) => void;
    onHasEnoughColorPointsByColor?: (card: BattleCard) => boolean;
    onCreditPoint?: (card: BattleCard) => void;
    onDebitPoint?: (card: BattleCard) => void;
    onMarked?: (card: Card) => void;
    onComplete?: (cardIds: string[]) => void;
    onLeave?: () => void;
} 