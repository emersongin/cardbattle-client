export type CardsetEvents = {
    onChangeIndex?: (cardIndex: number) => void;
    onMarked?: (cardId: string) => void;
    onComplete?: (cardIds: string[]) => void;
    onLeave?: () => void;
} 