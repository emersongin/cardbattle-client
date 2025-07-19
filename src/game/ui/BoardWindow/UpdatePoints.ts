import { BoardWindowData } from "@/game/types";

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