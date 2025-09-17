import { TweenConfig } from "@/game/types/TweenConfig";
import { BoardWindowData } from "@/game/objects/BoardWindowData";

export type BoardUpdateConfig = {
    fromTarget: BoardWindowData, 
    toTarget: BoardWindowData,
} & TweenConfig;