export type TweenConfig<T = any> = {
    duration?: number;
    ease?: string;
    delay?: number;
    hold?: number;
    repeat?: number;
    yoyo?: boolean;
    onStart?: (tween?: Phaser.Tweens.Tween) => void;
    onStartEach?: (item?: T) => void;
    onComplete?: (tween?: Phaser.Tweens.Tween) => void;
} & Partial<Phaser.Types.Tweens.TweenBuilderConfig>;