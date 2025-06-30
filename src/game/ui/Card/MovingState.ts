import { CardState } from "./CardState";
import CardTweens from "./CardTweens";
import { Move } from "./Move";

export default class MovingState extends CardTweens<Move> implements CardState {
    create(moves: Move[], duration: number) {
        console.log("MovingState create", this.card.name, moves, duration);
        this.addTweens(moves, duration);
    }

    addTweens(moves: Move[], duration: number) {
        const cardTweens = moves.map(move => {
            return {
                hold: 0,
                duration,
                ...move,
            };
        });
        this.pushCardTweens(cardTweens);
    }
}