import { BattleCard } from "../Card/BattleCard";
import { Card } from "../Card/Card";

export type CardsetEvents = {
    onChangeIndex?: (card: Card) => void;
    onHasEnoughColorPointsByColor?: (card: BattleCard) => boolean;
    onCreditPoint?: (card: BattleCard) => void;
    onDebitPoint?: (card: BattleCard) => void;
    onMarked?: (card: Card) => void;
    onComplete?: (cardIds: string[]) => void;
    onLeave?: () => void;
} 