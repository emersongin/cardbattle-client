import { TweenConfig } from "@types/TweenConfig";

export type PositionConfig = {
    xTo: number, 
    yTo: number, 
    xFrom?: number, 
    yFrom?: number
} & TweenConfig;