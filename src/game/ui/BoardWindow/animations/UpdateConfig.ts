import { BoardWindowData } from "@objects/BoardWindowData";
import { TweenConfig } from "@types/TweenConfig";

export type UpdateConfig = {
    target: BoardWindowData;
    from: number;
    to: number;
    onUpdate: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;