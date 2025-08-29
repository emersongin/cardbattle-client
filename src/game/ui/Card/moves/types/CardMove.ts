import { ExpandMove } from "../ExpandMove";
import { PositionMove } from "../PositionMove";
import { ShrinkMove } from "../ShrinkMove";
import { ExpandCardConfig } from "./ExpandCardConfig";
import { PositionCardConfig } from "./PositionCardConfig";

export type CardMove = [
    typeof ExpandMove.name | typeof ShrinkMove.name | typeof PositionMove.name, 
    ExpandCardConfig | PositionCardConfig
];