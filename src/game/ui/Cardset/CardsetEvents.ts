export type CardsetEvents = {
    onChangeIndex?: (cardIndex: number) => void;
    onMarked?: (cardIndex: number) => void;
    onCompleted?: (cardIndexes: number[]) => void;
    onLeave?: () => void;
} 