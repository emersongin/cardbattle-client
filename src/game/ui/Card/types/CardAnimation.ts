import { FlashAnimation } from "../FlashAnimation";
import { FlashCardConfig } from "./FlashCardConfig";

export type CardAnimation = [
    typeof FlashAnimation.name, 
    FlashCardConfig
];