import { FlashAnimation } from "./animations/FlashAnimation";
import { Card } from "./Card";
import { ExpandMove } from "./moves/ExpandMove";
import { ShrinkMove } from "./moves/ShrinkMove";
import { CardAnimation } from "./animations/types/CardAnimation";
import { ExpandCardConfig } from "./moves/types/ExpandCardConfig";
import { FlashCardConfig } from "./animations/types/FlashCardConfig";
import { CardMove } from "./moves/types/CardMove";
import { PositionCardConfig } from "./moves/types/PositionCardConfig";
import { PositionMove } from "./moves/PositionMove";
import { ScaleMove } from "./moves/ScaleMove";
import { CardScaleMoveConfig } from "./moves/types/CardScaleMoveConfig";

export class CardActionsBuilder {
    #moves: (CardMove | CardAnimation)[] = [];

    private constructor(readonly card: Card) {}

    static create(card: Card): CardActionsBuilder {
        return new CardActionsBuilder(card);
    }

    move(config: PositionCardConfig = { xTo: this.card.getX(), yTo: this.card.getY() }): CardActionsBuilder {
        this.#addMove([PositionMove.name, config]);
        return this;
    }

    open(config: CardScaleMoveConfig = {}): CardActionsBuilder {
        const onComplete = () => this.card.data.set('closed', false);
        config.open = true;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#addMove([ScaleMove.name, config]);
        return this;
    }

    close(config: CardScaleMoveConfig = {}): CardActionsBuilder {
        const onComplete = () => this.card.data.set('closed', true);
        config.open = false;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#addMove([ScaleMove.name, config]);
        return this;
    }

    faceUp(): CardActionsBuilder {
        const onComplete = () => {
            this.card.data.set('faceUp', true);
            this.card.getUi().setImage(true);
            this.card.getUi().setDisplay(this.card.data.get('ap'), this.card.data.get('hp'), true);
        };
        const config = { onComplete };
        this.#addMove(['faceup', config]);
        return this;
    }

    expand(config: ExpandCardConfig = {}): CardActionsBuilder {
        this.#addMove([ExpandMove.name, config]);
        return this;
    }

    flash(config: FlashCardConfig = {}): CardActionsBuilder {
        this.#addMove([FlashAnimation.name, config]);
        return this;
    }

    shrink(config: FlashCardConfig = {}): CardActionsBuilder {
        this.#addMove([ShrinkMove.name, config]);
        return this;
    }

    #addMove(moveOrAnimation: CardMove | CardAnimation): void {
        if (this.#moves.length > 0) {
            this.#addOnCompleteToLastMove((_card: Card) => {
                this.#runMoves(moveOrAnimation);
            });
            this.#moves.push(moveOrAnimation);
            return;
        }
        this.#moves.push(moveOrAnimation);
    }

    #runMoves(moveOrAnimation?: CardMove | CardAnimation): void {
        if (this.#moves.length > 0 && !moveOrAnimation) {
            moveOrAnimation = this.#moves[0];
        }
        const [name, config] = moveOrAnimation as CardMove | CardAnimation;
        switch (name) {
            case PositionMove.name:
                new PositionMove(this.card, config as PositionCardConfig);
                break;
            case ScaleMove.name:
                new ScaleMove(this.card, config as CardScaleMoveConfig);
                break;
            case ExpandMove.name:
                new ExpandMove(this.card, config as ExpandCardConfig);
                break;
            case ShrinkMove.name:
                new ShrinkMove(this.card, config as ExpandCardConfig);
                break;
            case FlashAnimation.name:
                new FlashAnimation(this.card, config as FlashCardConfig);
                break;
            case 'faceup':
                if (config?.onComplete) config.onComplete(this.card);
                break;
            default:
                throw new Error(`Unknown move or animation: ${name}`);
        }
    }

    #addOnCompleteToLastMove(onComplete: (card: Card) => void): void {
        if (this.#moves.length === 0) return;
        const [name, config] = this.#getLastMove();
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#moves[this.#moves.length - 1] = [name, config];
    }

    #getLastMove(): CardMove | CardAnimation {
        return this.#moves[this.#moves.length - 1];
    }

    #mergeOnComplete(onComplete: (card: Card) => void, original?: (card: Card) => void): () => void {
        return () => {
            if (original) original(this.card);
            onComplete(this.card);
        };
    }

    play(config?: ExpandCardConfig | FlashCardConfig | PositionCardConfig): void {
        if (config?.onComplete) {
            this.#addOnCompleteToLastMove(config.onComplete);
        }
        this.#runMoves();
    }
}