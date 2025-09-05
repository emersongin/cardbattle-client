import { FlashAnimation } from "../FlashAnimation";
import { UpdateAnimation } from "../UpdateAnimation";
import { FlashCardConfig } from "./FlashCardConfig";
import { UpdateCardConfig } from "./UpdateCardConfig";
import { ExpandAnimation } from "../ExpandAnimation";
import { ScaleAnimation } from "../ScaleAnimation";
import { PositionAnimation } from "../PositionAnimation";
import { ShrinkAnimation } from "../ShrinkAnimation";
import { ExpandCardConfig } from "./ExpandCardConfig";
import { CardScaleMoveConfig } from "./CardScaleMoveConfig";
import { PositionCardConfig } from "./PositionCardConfig";

export type CardAnimation = [
    typeof FlashAnimation.name | 
    typeof UpdateAnimation.name |
    typeof ExpandAnimation.name | 
    typeof ShrinkAnimation.name | 
    typeof PositionAnimation.name | 
    typeof ScaleAnimation.name,
    FlashCardConfig | 
    UpdateCardConfig | 
    ExpandCardConfig | 
    PositionCardConfig | 
    CardScaleMoveConfig
];