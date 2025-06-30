export type CardPoints = {
    target?: { ap: number; hp: number };
    from?: number;
    to?: number;
    duration?: number;
    ease?: string;
    onUpdate?: (tween: Phaser.Tweens.Tween) => void;
}