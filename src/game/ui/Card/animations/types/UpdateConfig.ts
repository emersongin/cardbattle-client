import { BattlePoints } from "@/game/objects/BattlePoints";
import { TweenConfig } from "@game/types/TweenConfig";

export type UpdateConfig = {
    target: BattlePoints;
    from: number;
    to: number;
    onUpdate: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;