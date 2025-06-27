export type Move = {
    x?: number;
    y?: number;
    duration?: number;
    scaleX?: number;
    scaleY?: number;
    yoyo?: boolean;
    ease?: string;
    onComplete?: () => void;
    onYoyo?: () => void;
}