export type BoardWindowData = {
    ap: number;
    hp: number;
    redPoints: number;
    greenPoints: number;
    bluePoints: number;
    blackPoints: number;
    whitePoints: number;
    orangePoints: number;
    numberOfCardsInHand: number,
    numberOfCardsInDeck: number,
    numberOfCardsInTrash: number,
    numberOfWins: number,
    pass: boolean;
};

export type MaybePartialBoardWindowData = BoardWindowData | Partial<BoardWindowData>;