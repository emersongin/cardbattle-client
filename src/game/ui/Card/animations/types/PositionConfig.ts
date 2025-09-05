import { TweenConfig } from "@/game/types/TweenConfig";

export type PositionConfig = {
    xTo: number, 
    yTo: number, 
    xFrom?: number, 
    yFrom?: number
} & TweenConfig;