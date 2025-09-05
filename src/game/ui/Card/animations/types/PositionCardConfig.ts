import { TweenConfig } from "@/game/types/TweenConfig";

export type PositionCardConfig = {
    xTo: number, 
    yTo: number, 
    xFrom?: number, 
    yFrom?: number
} & TweenConfig;