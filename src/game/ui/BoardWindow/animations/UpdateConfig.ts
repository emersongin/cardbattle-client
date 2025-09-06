import { BoardWindowData } from "@/game/objects/BoardWindowData";
import { TweenConfig } from "@/game/types/TweenConfig";

export type UpdateConfig = {
    target: BoardWindowData;
    from: number;
    to: number;
    onUpdate: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;