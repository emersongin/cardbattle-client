import { CardPointsData } from "@/game/objects/CardPointsData";
import { TweenConfig } from "@/game/types/TweenConfig";

export type UpdateConfig = {
    target: CardPointsData;
    from: number;
    to: number;
    onUpdate: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;