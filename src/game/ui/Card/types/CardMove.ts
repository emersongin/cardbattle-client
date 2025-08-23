import { ExpandMove } from "../ExpandMove";
import { ShrinkMove } from "../ShrinkMove";
import { ExpandCardConfig } from "./ExpandCardConfig";

export type CardMove = [
    typeof ExpandMove.name | typeof ShrinkMove.name, 
    ExpandCardConfig
];