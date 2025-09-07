export type CardsetEvents = {
    onChangeIndex?: (cardId: string) => void;
    onCreditPoint?: (cardId: string) => void;
    onDebitPoint?: (cardId: string) => void;
    onMarked?: (cardId: string) => void;
    onComplete?: (cardIds: string[]) => void;
    onLeave?: () => void;
} 