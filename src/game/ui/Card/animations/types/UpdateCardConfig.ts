import { CardPoints } from "../../types/CardPoints";

export type UpdateCardConfig = {
    target: CardPoints;
    hold?: number;
    from?: number;
    to?: number;
    duration?: number;
    ease?: string;
    onComplete?: () => void;
    onUpdate?: (tween: Phaser.Tweens.Tween) => void;
};