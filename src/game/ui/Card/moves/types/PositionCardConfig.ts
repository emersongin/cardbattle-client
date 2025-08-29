import { Card } from "../../Card"

export type PositionCardConfig = {
    xTo: number, 
    yTo: number, 
    xFrom?: number, 
    yFrom?: number, 
    delay?: number, 
    duration?: number,
    onStart?: (card?: Card) => void,
    onComplete?: (card?: Card) => void
}