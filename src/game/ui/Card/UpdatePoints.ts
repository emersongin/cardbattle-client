export type UpdatePoints = {
    target: { value: number };
    from?: number;
    to?: number;
    duration?: number;
    ease?: string;
    onComplete?: () => void;
    onUpdate?: (tween: Phaser.Tweens.Tween) => void;
}