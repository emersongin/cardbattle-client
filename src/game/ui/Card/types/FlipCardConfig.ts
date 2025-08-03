import { Card } from "../Card";

export type FlipCardConfig = {
    delay?: number,
    onComplete?: (card?: Card) => void
};