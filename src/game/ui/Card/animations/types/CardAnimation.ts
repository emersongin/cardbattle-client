import { FlashAnimation } from "../FlashAnimation";
import { UpdateAnimation } from "../UpdateAnimation";
import { FlashConfig } from "./FlashConfig";
import { UpdateConfig } from "./UpdateConfig";
import { ExpandAnimation } from "../ExpandAnimation";
import { ScaleAnimation } from "../ScaleAnimation";
import { PositionAnimation } from "../PositionAnimation";
import { ShrinkAnimation } from "../ShrinkAnimation";
import { ExpandConfig } from "./ExpandConfig";
import { ScaleConfig } from "./ScaleConfig";
import { PositionConfig } from "./PositionConfig";

export type CardAnimation = [
    typeof FlashAnimation.name | 
    typeof UpdateAnimation.name |
    typeof ExpandAnimation.name | 
    typeof ShrinkAnimation.name | 
    typeof PositionAnimation.name | 
    typeof ScaleAnimation.name,
    FlashConfig | 
    UpdateConfig | 
    ExpandConfig | 
    PositionConfig | 
    ScaleConfig
];