import { Card } from "../Card";

export type ExpandCardConfig = {
    delay?: number,
    duration?: number
    onComplete?: (card: Card) => void,
};