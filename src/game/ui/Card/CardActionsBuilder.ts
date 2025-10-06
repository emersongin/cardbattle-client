import { Card } from "@ui/Card/Card";
import { FlashAnimation } from "@ui/Card/animations/FlashAnimation";
import { ExpandAnimation } from "@ui/Card/animations/ExpandAnimation";
import { ShrinkAnimation } from "@ui/Card/animations/ShrinkAnimation";
import { PositionAnimation } from "@ui/Card/animations/PositionAnimation";
import { ScaleAnimation } from "@ui/Card/animations/ScaleAnimation";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";
import { FlashConfig } from "@ui/Card/animations/types/FlashConfig";
import { PositionConfig } from "@ui/Card/animations/types/PositionConfig";
import { ScaleConfig } from "@ui/Card/animations/types/ScaleConfig";
import { TweenConfig } from "@game/types/TweenConfig";
import { BattleCard } from "./BattleCard";
import { CardAction, CardAnimation } from "@ui/Card/animations/types/CardAction";
import { EXPAND_ANIMATION, FACE_UP_ANIMATION, FLASH_ANIMATION, 
    POSITION_ANIMATION, SCALE_ANIMATION, SHRINK_ANIMATION } from "@game/constants/keys";

export class CardActionsBuilder {
    #actions: CardAction[] = [];
    #currentAction: CardAnimation;

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
        this.#addAction({ name: POSITION_ANIMATION, config });
        return this;
    }

    open(config: TweenConfig): CardActionsBuilder {
        const onComplete = () => this.card.data.set('closed', false);
        config.open = true;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete || (() => {}));
        this.#addAction({ name: SCALE_ANIMATION, config });
        return this;
    }

    close(config: TweenConfig): CardActionsBuilder {
        const onComplete = () => this.card.setClosed();
        config.open = false;
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete || (() => {}));
        this.#addAction({ name: SCALE_ANIMATION, config });
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
        this.#addAction({ name: FACE_UP_ANIMATION, config });
        return this;
    }

    expand(config?: ExpandConfig): CardActionsBuilder {
        if (!config) config = { onComplete: () => {} };
        this.#addAction({ name: EXPAND_ANIMATION, config });
        return this;
    }

    shrink(config?: ExpandConfig): CardActionsBuilder {
        if (!config) config = { onComplete: () => {} };
        this.#addAction({ name: SHRINK_ANIMATION, config });
        return this;
    }

    flash(config?: FlashConfig): CardActionsBuilder {
        if (!config) config = { color: 0xffffff, onComplete: () => {} };
        this.#addAction({ name: FLASH_ANIMATION, config });
        return this;
    }

    #addAction(moveOrAnimation: CardAction): void {
        if (this.#actions.length > 0) {
            this.#addOnCompleteToLastAction(() => {
                this.#runActions(moveOrAnimation);
            });
            this.#actions.push(moveOrAnimation);
            return;
        }
        this.#actions.push(moveOrAnimation);
    }

    #runActions(moveOrAnimation?: CardAction): void {
        if (this.#actions.length > 0 && !moveOrAnimation) {
            moveOrAnimation = this.#actions[0];
        }
        const { name, config } = moveOrAnimation as CardAction;
        switch (name) {
            case POSITION_ANIMATION:
                this.#currentAction = new PositionAnimation(this.card, config as PositionConfig);
                break;
            case SCALE_ANIMATION:
                this.#currentAction = new ScaleAnimation(this.card, config as ScaleConfig);
                break;
            case EXPAND_ANIMATION:
                this.#currentAction = new ExpandAnimation(this.card, config as ExpandConfig);
                break;
            case SHRINK_ANIMATION:
                this.#currentAction = new ShrinkAnimation(this.card, config as ExpandConfig);
                break;
            case FLASH_ANIMATION:
                this.#currentAction = new FlashAnimation(this.card, config as FlashConfig);
                break;
            case FACE_UP_ANIMATION:
                if (config?.onComplete) config.onComplete();
                break;
            default:
                throw new Error(`Unknown move or animation: ${name}`);
        }
    }

    #addOnCompleteToLastAction(onComplete: () => void): void {
        if (this.#actions.length === 0) return;
        const { name, config } = this.#getLastAction();
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#replaceLastAction({ name, config });
    }

    #replaceLastAction(cardAnimation: CardAction): void {
        this.#actions[this.#actions.length - 1] = cardAnimation;
    }

    #getLastAction(): CardAction {
        return this.#actions[this.#actions.length - 1];
    }

    #mergeOnComplete(onComplete: () => void, original?: () => void): () => void {
        return () => {
            if (original) original();
            onComplete();
        };
    }

    play(config?: ExpandConfig | FlashConfig | PositionConfig): void {
        if (config?.onComplete) {
            this.#addOnCompleteToLastAction(config.onComplete);
        }
        this.#runActions();
    }

    getCurrentAction(): CardAnimation {
        return this.#currentAction;
    }
}