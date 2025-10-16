import { FlashConfig } from "@ui/Card/animations/types/FlashConfig";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";
import { ScaleConfig } from "@ui/Card/animations/types/ScaleConfig";
import { MoveConfig } from "@ui/Card/animations/types/MoveConfig";
import { UpdateConfig } from "@ui/Card/animations/types/UpdateConfig";
import { EXPAND_ANIMATION, FACE_UP_ANIMATION, FLASH_ANIMATION, 
    POSITION_ANIMATION, SCALE_ANIMATION, SHRINK_ANIMATION, UPDATE_ANIMATION } from "@game/constants/keys";
import { FlashAnimation } from "../FlashAnimation";
import { ExpandAnimation } from "../ExpandAnimation";
import { ShrinkAnimation } from "../ShrinkAnimation";
import { MoveAnimation } from "../MoveAnimation";
import { ScaleAnimation } from "../ScaleAnimation";

export type CardAction = {
    name: CardActionName;
    config: CardActionConfig;
};

export type CardAnimation = 
    FlashAnimation | 
    ExpandAnimation | 
    ShrinkAnimation | 
    MoveAnimation | 
    ScaleAnimation;

export type CardActionName = 
    typeof FLASH_ANIMATION | 
    typeof UPDATE_ANIMATION | 
    typeof EXPAND_ANIMATION | 
    typeof SCALE_ANIMATION | 
    typeof POSITION_ANIMATION | 
    typeof SHRINK_ANIMATION |
    typeof FACE_UP_ANIMATION;

export type CardActionConfig =
    MoveConfig | 
    FlashConfig | 
    UpdateConfig | 
    ExpandConfig | 
    ScaleConfig;