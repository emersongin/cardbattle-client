export type CardsetEvents = {
    onChangeIndex?: (cardIndex: number) => void;
    onMarked?: (cardIndex: number) => void;
    onComplete?: (cardIndexes: number[]) => void;
    onLeave?: () => void;
} 