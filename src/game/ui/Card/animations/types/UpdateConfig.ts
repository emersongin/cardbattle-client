import { BattlePointsData } from "@/game/objects/BattlePointsData";
import { TweenConfig } from "@game/types/TweenConfig";

export type UpdateConfig = {
    target: BattlePointsData;
    from: number;
    to: number;
    onUpdate: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;