import { TweenConfig } from "@/game/types/TweenConfig";
import { CardPoints } from "../../types/CardPoints";

export type UpdateCardConfig = {
    target: CardPoints;
    from?: number;
    to?: number;
    onUpdate?: (tween: Phaser.Tweens.Tween) => void;
} & TweenConfig;