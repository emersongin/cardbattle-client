import { BoardWindowData } from "./BoardWindow";

export type UpdatePoints = {
    target: BoardWindowData;
    hold?: number;
    from?: number;
    to?: number;
    duration?: number;
    ease?: string;
    onComplete?: () => void;
    onUpdate?: (tween: Phaser.Tweens.Tween) => void;
}