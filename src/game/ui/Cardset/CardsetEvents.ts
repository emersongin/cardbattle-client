export type CardsetEvents = {
    onChangeIndex?: (cardId: string) => void;
    onMarked?: (cardId: string) => void;
    onComplete?: (cardIds: string[]) => void;
    onLeave?: () => void;
} 