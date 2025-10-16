import { Card } from "@ui/Card/Card";
import { FlashAnimation } from "@ui/Card/animations/FlashAnimation";
import { ExpandAnimation } from "@ui/Card/animations/ExpandAnimation";
import { ShrinkAnimation } from "@ui/Card/animations/ShrinkAnimation";
import { MoveAnimation } from "@ui/Card/animations/MoveAnimation";
import { ScaleAnimation } from "@ui/Card/animations/ScaleAnimation";
import { ExpandConfig } from "@ui/Card/animations/types/ExpandConfig";
import { FlashConfig } from "@ui/Card/animations/types/FlashConfig";
import { MoveConfig } from "@ui/Card/animations/types/MoveConfig";
import { ScaleConfig } from "@ui/Card/animations/types/ScaleConfig";
import { TweenConfig } from "@game/types/TweenConfig";
import { CardAction, CardActionConfig } from "@ui/Card/animations/types/CardAction";
import { EXPAND_ANIMATION, FACE_UP_ANIMATION, FLASH_ANIMATION, 
    POSITION_ANIMATION, SCALE_ANIMATION, SHRINK_ANIMATION } from "@game/constants/keys";

export class CardActionsBuilder {
    #actions: CardAction[] = [];

    private constructor(readonly card: Card) {}

    static create(card: Card): CardActionsBuilder {
        return new CardActionsBuilder(card);
    }

    move(config: MoveConfig): CardActionsBuilder {
        this.#addAction({ name: POSITION_ANIMATION, config: config });
        return this;
    }

    open(config: ScaleConfig = { open: true, delay: 0, duration: 0 }): CardActionsBuilder {
        config.open = true;
        this.#addAction({ name: SCALE_ANIMATION, config: config });
        return this;
    }

    close(config: ScaleConfig = { open: false, delay: 0, duration: 0 }): CardActionsBuilder {
        config.open = false;
        this.#addAction({ name: SCALE_ANIMATION, config: config });
        return this;
    }

    faceUp(config: TweenConfig = {}): CardActionsBuilder {
        this.#addAction({ name: FACE_UP_ANIMATION, config: config });
        return this;
    }

    expand(config: ExpandConfig = {}): CardActionsBuilder {
        this.#addAction({ name: EXPAND_ANIMATION, config: config });
        return this;
    }

    shrink(config: ExpandConfig = {}): CardActionsBuilder {
        this.#addAction({ name: SHRINK_ANIMATION, config: config });
        return this;
    }

    flash(config: FlashConfig = { color: 0xffffff}): CardActionsBuilder {
        this.#addAction({ name: FLASH_ANIMATION, config: config });
        return this;
    }

    #addAction(action: CardAction): void {
        if (this.#hasActions()) {
            this.#addOnCompleteToLastAction(() => this.#runAction(action));
            this.#actions.push(action);
            return;
        }
        this.#actions.push(action);
    }

    #hasActions(): boolean {
        return this.#actions.length > 0;
    }

    #runAction(action: CardAction): void {
        const { name, config } = action;
        switch (name) {
            case POSITION_ANIMATION:
                new MoveAnimation(this.card, config as MoveConfig);
                break;
            case SCALE_ANIMATION:
                new ScaleAnimation(this.card, config as ScaleConfig);
                break;
            case EXPAND_ANIMATION:
                new ExpandAnimation(this.card, config as ExpandConfig);
                break;
            case SHRINK_ANIMATION:
                new ShrinkAnimation(this.card, config as ExpandConfig);
                break;
            case FLASH_ANIMATION:
                new FlashAnimation(this.card, config as FlashConfig);
                break;
            case FACE_UP_ANIMATION:
                this.#faceUpAction(config as TweenConfig);
                break;
            default:
                throw new Error(`Unknown action: ${name}`);
        }
    }

    #faceUpAction(config?: TweenConfig): void {
        this.card.faceUp();
        if (config?.onComplete) config.onComplete();
    }

    #addOnCompleteToLastAction(onComplete: () => void): void {
        if (this.#hasActions() === false) return;
        const { name, config } = this.#getLastAction();
        config.onComplete = this.#mergeOnComplete(onComplete, config?.onComplete);
        this.#replaceLastAction({ name, config });
    }

    #replaceLastAction(cardAnimation: CardAction): void {
        this.#actions[this.#getLastIndex()] = cardAnimation;
    }

    #getLastIndex(): number {
        return this.#actions.length - 1;
    }

    #getLastAction(): CardAction {
        return this.#actions[this.#getLastIndex()];
    }

    #mergeOnComplete(onComplete: () => void, original?: () => void): () => void {
        return () => {
            if (original) original();
            onComplete();
        };
    }

    play(config?: CardActionConfig): void {
        if (config?.onComplete) {
            this.#addOnCompleteToLastAction(config.onComplete);
        }
        this.#runAction(this.#getFirstAction());
    }

    #getFirstAction(): CardAction {
        if (!this.#hasActions()) {
            throw new Error("No actions to play.");
        }
        return this.#actions[0];
    }

}