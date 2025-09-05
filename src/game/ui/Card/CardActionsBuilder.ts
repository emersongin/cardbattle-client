import { FlashAnimation } from "./animations/FlashAnimation";
import { Card } from "./Card";
import { ExpandAnimation } from "./animations/ExpandAnimation";
import { ShrinkAnimation } from "./animations/ShrinkAnimation";
import { CardAnimation } from "./animations/types/CardAnimation";
import { ExpandCardConfig } from "./animations/types/ExpandConfig";
import { FlashCardConfig } from "./animations/types/FlashConfig";
import { PositionCardConfig } from "./animations/types/PositionConfig";
import { PositionAnimation } from "./animations/PositionAnimation";
import { ScaleAnimation } from "./animations/ScaleAnimation";
import { CardScaleConfig } from "./animations/types/ScaleConfig";
import { TweenConfig } from "@/game/types/TweenConfig";

export class CardActionsBuilder {
    #moves: CardAnimation[] = [];

    private constructor(readonly card: Card) {}

    static create(card: Card): CardActionsBuilder {
        return new CardActionsBuilder(card);
    }

    move(config: PositionCardConfig & TweenConfig = { xTo: this.card.getX(), yTo: this.card.getY() }): CardActionsBuilder {
        this.#addMove([PositionAnimation.name, config]);
        return this;
    }

    open(config: CardScaleConfig = {}): CardActionsBuilder {
        const onComplete = () => this.card.data.set('closed', false);
        config.open = true;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#addMove([ScaleAnimation.name, config]);
        return this;
    }

    close(config: CardScaleConfig = {}): CardActionsBuilder {
        const onComplete = () => this.card.data.set('closed', true);
        config.open = false;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#addMove([ScaleAnimation.name, config]);
        return this;
    }

    faceUp(): CardActionsBuilder {
        const onComplete = () => {
            this.card.data.set('faceUp', true);
            this.card.getUi().setImage();
            this.card.getUi().setDisplay(this.card.data.get('ap'), this.card.data.get('hp'));
        };
        const config = { onComplete };
        this.#addMove(['faceup', config]);
        return this;
    }

    expand(config: ExpandCardConfig = {}): CardActionsBuilder {
        this.#addMove([ExpandAnimation.name, config]);
        return this;
    }

    flash(config: FlashCardConfig = {}): CardActionsBuilder {
        this.#addMove([FlashAnimation.name, config]);
        return this;
    }

    shrink(config: FlashCardConfig = {}): CardActionsBuilder {
        this.#addMove([ShrinkAnimation.name, config]);
        return this;
    }

    #addMove(moveOrAnimation: CardAnimation): void {
        if (this.#moves.length > 0) {
            this.#addOnCompleteToLastMove(() => {
                this.#runMoves(moveOrAnimation);
            });
            this.#moves.push(moveOrAnimation);
            return;
        }
        this.#moves.push(moveOrAnimation);
    }

    #runMoves(moveOrAnimation?: CardAnimation): void {
        if (this.#moves.length > 0 && !moveOrAnimation) {
            moveOrAnimation = this.#moves[0];
        }
        const [name, config] = moveOrAnimation as CardAnimation;
        switch (name) {
            case PositionAnimation.name:
                new PositionAnimation(this.card, config as PositionCardConfig);
                break;
            case ScaleAnimation.name:
                new ScaleAnimation(this.card, config as CardScaleConfig);
                break;
            case ExpandAnimation.name:
                new ExpandAnimation(this.card, config as ExpandCardConfig);
                break;
            case ShrinkAnimation.name:
                new ShrinkAnimation(this.card, config as ExpandCardConfig);
                break;
            case FlashAnimation.name:
                new FlashAnimation(this.card, config as FlashCardConfig);
                break;
            case 'faceup':
                if (config?.onComplete) config.onComplete();
                break;
            default:
                throw new Error(`Unknown move or animation: ${name}`);
        }
    }

    #addOnCompleteToLastMove(onComplete: () => void): void {
        if (this.#moves.length === 0) return;
        const [name, config] = this.#getLastMove();
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#moves[this.#moves.length - 1] = [name, config];
    }

    #getLastMove(): CardAnimation {
        return this.#moves[this.#moves.length - 1];
    }

    #mergeOnComplete(onComplete: () => void, original?: () => void): () => void {
        return () => {
            if (original) original();
            onComplete();
        };
    }

    play(config?: ExpandCardConfig | FlashCardConfig | PositionCardConfig): void {
        if (config?.onComplete) {
            this.#addOnCompleteToLastMove(config.onComplete);
        }
        this.#runMoves();
    }
}