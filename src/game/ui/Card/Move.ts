export type Move = {
    hold?: number;
    x?: number;
    y?: number;
    duration?: number;
    scaleX?: number;
    scaleY?: number;
    yoyo?: boolean;
    ease?: string;
    canStart?: () => boolean;
    onComplete?: () => void;
    onYoyo?: () => void;
}