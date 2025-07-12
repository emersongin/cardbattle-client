import { CardPoints } from "./CardPoints";

export type UpdatePoints = {
    hold?: number;
    target: CardPoints;
    from?: number;
    to?: number;
    duration?: number;
    ease?: string;
    onComplete?: () => void;
    onUpdate?: (tween: Phaser.Tweens.Tween) => void;
}