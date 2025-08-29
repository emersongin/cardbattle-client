import { Card } from "../../Card"

export type OpenCloseCardConfig = {
    open?: boolean,
    delay?: number, 
    duration?: number, 
    onCanStart?: () => boolean, 
    onComplete?: (card?: Card) => void
}