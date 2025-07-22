import { Card } from "../Card";

export type Move = {
    hold?: number;
    x?: number;
    y?: number;
    duration?: number;
    scaleX?: number;
    scaleY?: number;
    yoyo?: boolean;
    ease?: string;
    delay?: number;
    canStart?: () => boolean;
    onComplete?: (card?: Card) => void;
    onYoyo?: () => void;
}