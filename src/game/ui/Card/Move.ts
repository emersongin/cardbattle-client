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
    onComplete?: () => void;
    onYoyo?: () => void;
}