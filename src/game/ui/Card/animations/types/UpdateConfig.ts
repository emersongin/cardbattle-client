import { TweenConfig } from "@/game/types/TweenConfig";
import { CardPoints } from "../../../Card/types/CardPoints";

export type UpdateConfig = {
    target: CardPoints;
    from: number;
    to: number;
    onUpdate: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;