import { Card } from "../Card"

export type OpenCardConfig = {
    delay?: number, 
    duration?: number, 
    onCanStart?: () => boolean, 
    onComplete?: (card?: Card) => void
}