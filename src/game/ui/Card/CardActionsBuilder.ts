import { Card } from "@ui/Card/Card";
import { FlashAnimation } from "@ui/Card/animations/FlashAnimation";
import { ExpandAnimation } from "@ui/Card/animations/ExpandAnimation";
import { ShrinkAnimation } from "@ui/Card/animations/ShrinkAnimation";
import { PositionAnimation } from "@ui/Card/animations/PositionAnimation";
import { ScaleAnimation } from "@ui/Card/animations/ScaleAnimation";
import { CardAnimation } from "@ui/Card/animations/types/CardAnimation";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";
import { FlashConfig } from "@ui/Card/animations/types/FlashConfig";
import { PositionConfig } from "@ui/Card/animations/types/PositionConfig";
import { ScaleConfig } from "@ui/Card/animations/types/ScaleConfig";
import { TweenConfig } from "@game/types/TweenConfig";
import { BattleCard } from "./BattleCard";

export class CardActionsBuilder {
    #moves: CardAnimation[] = [];

    private constructor(readonly card: Card) {}

    static create(card: Card): CardActionsBuilder {
        return new CardActionsBuilder(card);
    }

    move(config: PositionConfig): CardActionsBuilder {
        if (!config) config = { 
            xTo: this.card.getX(), 
            yTo: this.card.getY(), 
            onComplete: () => {} 
        };
        this.#addMove({ name: PositionAnimation.name, config });
        return this;
    }

    open(config: TweenConfig): CardActionsBuilder {
        const onComplete = () => this.card.data.set('closed', false);
        config.open = true;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete || (() => {}));
        this.#addMove({ name: ScaleAnimation.name, config });
        return this;
    }

    close(config: TweenConfig): CardActionsBuilder {
        const onComplete = () => this.card.data.set('closed', true);
        config.open = false;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete || (() => {}));
        this.#addMove({ name: ScaleAnimation.name, config });
        return this;
    }

    faceUp(): CardActionsBuilder {
        const onComplete = () => {
            this.card.faceUp();
            this.card.setImage();
            if (this.card instanceof BattleCard) {
                this.card.setDisplayPoints(this.card.getAp(), this.card.getHp());
                return;
            }
            this.card.setDisplay();
        };
        const config = { onComplete };
        this.#addMove({ name: 'faceup', config });
        return this;
    }

    expand(config?: ExpandConfig): CardActionsBuilder {
        if (!config) config = { onComplete: () => {} };
        this.#addMove({ name: ExpandAnimation.name, config });
        return this;
    }

    shrink(config?: ExpandConfig): CardActionsBuilder {
        if (!config) config = { onComplete: () => {} };
        this.#addMove({ name: ShrinkAnimation.name, config });
        return this;
    }

    flash(config?: FlashConfig): CardActionsBuilder {
        if (!config) config = { color: 0xffffff, onComplete: () => {} };
        this.#addMove({ name: FlashAnimation.name, config });
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
        const {name, config} = moveOrAnimation as CardAnimation;
        switch (name) {
            case PositionAnimation.name:
                new PositionAnimation(this.card, config as PositionConfig);
                break;
            case ScaleAnimation.name:
                new ScaleAnimation(this.card, config as ScaleConfig);
                break;
            case ExpandAnimation.name:
                new ExpandAnimation(this.card, config as ExpandConfig);
                break;
            case ShrinkAnimation.name:
                new ShrinkAnimation(this.card, config as ExpandConfig);
                break;
            case FlashAnimation.name:
                new FlashAnimation(this.card, config as FlashConfig);
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
        const { name, config } = this.#getLastMove();
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#replaceLastMove({ name, config });
    }

    #replaceLastMove(cardAnimation: CardAnimation): void {
        this.#moves[this.#moves.length - 1] = cardAnimation;
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

    play(config?: ExpandConfig | FlashConfig | PositionConfig): void {
        if (config?.onComplete) {
            this.#addOnCompleteToLastMove(config.onComplete);
        }
        this.#runMoves();
    }
}