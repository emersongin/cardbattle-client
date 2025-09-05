export type TweenConfig = {
    duration?: number;
    ease?: string;
    delay?: number;
    hold?: number;
    repeat?: number;
    yoyo?: boolean;
    onStart?: (tween?: Phaser.Tweens.Tween) => void;
    onComplete?: (tween?: Phaser.Tweens.Tween) => void;
}