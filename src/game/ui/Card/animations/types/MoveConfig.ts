import { TweenConfig } from "@game/types/TweenConfig";

export type MoveConfig = {
    toX: number, 
    toY: number, 
    fromX?: number, 
    fromY?: number
} & TweenConfig;