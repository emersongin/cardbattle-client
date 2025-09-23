export type CardsetEvents = {
    onChangeIndex?: (cardId: string) => void;
    onHasEnoughColorPointsByColor?: (cardId: string) => boolean;
    onCreditPoint?: (cardId: string) => void;
    onDebitPoint?: (cardId: string) => void;
    onMarked?: (cardId: string) => void;
    onComplete?: (cardIds: string[]) => void;
    onLeave?: () => void;
} 