import { TweenConfig } from "@game/types/TweenConfig";

export type PositionConfig = {
    toX: number, 
    toY: number, 
    fromX?: number, 
    fromY?: number
} & TweenConfig;