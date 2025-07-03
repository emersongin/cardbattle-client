import { Card } from "../Card/Card";

export type CardsetEvents = {
    onChangeIndex?: (card: Card) => void;
    onChoice?: () => void;
    onSelect?: () => void;
    onLeave?: () => void;
} 