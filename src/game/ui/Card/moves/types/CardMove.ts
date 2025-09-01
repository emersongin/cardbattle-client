import { ExpandMove } from "../ExpandMove";
import { ScaleMove } from "../ScaleMove";
import { PositionMove } from "../PositionMove";
import { ShrinkMove } from "../ShrinkMove";
import { ExpandCardConfig } from "./ExpandCardConfig";
import { CardScaleMoveConfig } from "./CardScaleMoveConfig";
import { PositionCardConfig } from "./PositionCardConfig";

export type CardMove = [
    typeof ExpandMove.name | 
    typeof ShrinkMove.name | 
    typeof PositionMove.name | 
    typeof ScaleMove.name,
    // Config types
    ExpandCardConfig | 
    PositionCardConfig | 
    CardScaleMoveConfig
];