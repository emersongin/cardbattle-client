import { Card } from "../../Card"

export type CardScaleMoveConfig = {
    open?: boolean,
    delay?: number, 
    duration?: number, 
    onCanStart?: () => boolean, 
    onComplete?: (card?: Card) => void
}