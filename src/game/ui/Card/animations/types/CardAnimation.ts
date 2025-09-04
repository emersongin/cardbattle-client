import { FlashAnimation } from "../FlashAnimation";
import { UpdateAnimation } from "../UpdateAnimation";
import { FlashCardConfig } from "./FlashCardConfig";
import { UpdateCardConfig } from "./UpdateCardConfig";

export type CardAnimation = [
    typeof FlashAnimation.name | typeof UpdateAnimation.name,
    FlashCardConfig | UpdateCardConfig
];