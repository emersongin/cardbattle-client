import { Card } from "../Card/Card";

export type CardsetEvents = {
    onChangeIndex?: (card: Card) => void;
    onHasEnoughColorPointsByColor?: (card: Card) => boolean;
    onCreditPoint?: (card: Card) => void;
    onDebitPoint?: (card: Card) => void;
    onMarked?: (card: Card) => void;
    onComplete?: (cardIds: string[]) => void;
    onLeave?: () => void;
} 