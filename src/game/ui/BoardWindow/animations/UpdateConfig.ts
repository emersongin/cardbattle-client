import { TweenConfig } from "@/game/types/TweenConfig";
import { BoardWindowData } from "@game/types";

export type UpdateConfig = {
    target: BoardWindowData;
    from: number;
    to: number;
    onUpdate: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;