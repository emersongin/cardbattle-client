import { FlashAnimation } from "../FlashAnimation";
import { UpdateAnimation } from "../UpdateAnimation";
import { ExpandAnimation } from "../ExpandAnimation";
import { ScaleAnimation } from "../ScaleAnimation";
import { PositionAnimation } from "../PositionAnimation";
import { ShrinkAnimation } from "../ShrinkAnimation";
import { FlashConfig } from "./FlashConfig";
import { UpdateConfig } from "./UpdateConfig";
import { ExpandConfig } from "./ExpandConfig";
import { ScaleConfig } from "./ScaleConfig";
import { PositionConfig } from "./PositionConfig";

export type CardAnimation = {
    name: 
        typeof FlashAnimation.name | 
        typeof UpdateAnimation.name | 
        typeof ExpandAnimation.name | 
        typeof ScaleAnimation.name | 
        typeof PositionAnimation.name | 
        typeof ShrinkAnimation.name | 
        'faceup';
    config: FlashConfig | UpdateConfig | ExpandConfig | ScaleConfig | PositionConfig | { onComplete?: () => void }
};