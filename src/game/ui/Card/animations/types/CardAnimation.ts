import { FlashAnimation } from "@ui/Card/animations/FlashAnimation";
import { ExpandAnimation } from "@ui/Card/animations/ExpandAnimation";
import { ScaleAnimation } from "@ui/Card/animations/ScaleAnimation";
import { PositionAnimation } from "@ui/Card/animations/PositionAnimation";
import { ShrinkAnimation } from "@ui/Card/animations/ShrinkAnimation";
import { UpdateAnimation } from "@ui/Card/animations/UpdateAnimation";
import { FlashConfig } from "@ui/Card/animations/types/FlashConfig";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";
import { ScaleConfig } from "@ui/Card/animations/types/ScaleConfig";
import { PositionConfig } from "@ui/Card/animations/types/PositionConfig";
import { UpdateConfig } from "@ui/Card/animations/types/UpdateConfig";

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