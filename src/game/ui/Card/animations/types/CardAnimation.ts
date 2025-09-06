import { FlashAnimation } from "../FlashAnimation";
import { ExpandAnimation } from "../ExpandAnimation";
import { ScaleAnimation } from "../ScaleAnimation";
import { PositionAnimation } from "../PositionAnimation";
import { ShrinkAnimation } from "../ShrinkAnimation";
import { UpdateAnimation } from "../UpdateAnimation";
import { FlashConfig } from "./FlashConfig";
import { ExpandConfig } from "./ExpandConfig";
import { ScaleConfig } from "./ScaleConfig";
import { PositionConfig } from "./PositionConfig";
import { UpdateConfig } from "@/game/ui/Card/animations/types/UpdateConfig";

export type CardAnimation = {
    name: 
        typeof FlashAnimation.name | 
        typeof UpdateAnimation.name | 
        typeof ExpandAnimation.name | 
        typeof ScaleAnimation.name | 
        typeof PositionAnimation.name | 
        typeof ShrinkAnimation.name | 
        'faceup';
    config: 
        PositionConfig | 
        FlashConfig | 
        UpdateConfig | 
        ExpandConfig | 
        ScaleConfig
};