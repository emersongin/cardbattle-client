import { Card } from "../Card"

export type CloseCardConfig = {
    delay: number, 
    duration?: number, 
    onCanStart?: () => boolean, 
    onComplete?: (card?: Card) => void
}