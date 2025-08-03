import { Card } from "../Card";

export type FlashCardConfig = {
    color?: number,
    delay?: number,
    duration?: number,
    onStart?: (card: Card) => void,
    onComplete?: (card: Card) => void
};