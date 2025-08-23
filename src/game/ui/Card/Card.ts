import { CardPoints } from "./types/CardPoints";
import { CardState, StaticState, MovingState, UpdatingState, FlashState } from "./state/CardState";
import { CardUi } from "./CardUi";
import { Move } from "./types/Move";
import { CardData } from "@game/types";
import { Cardset } from "../Cardset/Cardset";
import { MoveCardConfig } from "./types/MoveCardConfig";
import { FlipCardConfig } from "./types/FlipCardConfig";
import { CloseCardConfig } from "./types/CloseCardConfig";
import { OpenCardConfig } from "./types/OpenCardConfig";
import { FlashCardConfig } from "./types/FlashCardConfig";
import { CardColors } from "./types/CardColors";
import { BATTLE, POWER } from "@/game/constants/keys";
import { CardType } from "./types/CardType";
import { ExpandCardConfig } from "./types/ExpandCardConfig";
import { CardMove } from "./types/CardMove";
import { ExpandMove } from "./ExpandMove";
import { FlashAnimation } from "./FlashAnimation";
import { ShrinkMove } from "./ShrinkMove";
import { CardAnimation } from "./types/CardAnimation";

export class Card extends Phaser.GameObjects.GameObject {
    #ui: CardUi;
    #status: CardState;
    #moveState: ExpandMove | FlashAnimation | ShrinkMove;
    #moves: (CardMove | CardAnimation)[] = [];

    constructor(
        readonly scene: Phaser.Scene, 
        readonly cardset: Cardset,
        readonly staticData: CardData
    ) {
        super(scene, 'Card');
        this.#ui = new CardUi(this.scene, this, staticData);
        this.#setStartData();
        this.changeState(new StaticState(this));
        this.cardset.add(this.#ui);
    }

    getAllData(): CardPoints {
        return { ap: this.data.get('ap'), hp: this.data.get('hp') };
    }

    #setStartData(): void {
        this.setDataEnabled();
        this.updateOrigin();
        this.data.set('ap', this.staticData.hp);
        this.data.set('hp', this.staticData.ap);
        this.data.set('faceUp', false);
        this.data.set('closed', false);
        this.data.set('selected', false);
        this.data.set('marked', false);
        this.data.set('highlight', false);
        this.data.set('disabled', false);
    }

    changeState(state: CardState, ...args: any[]): void {
        this.#status = state;
        if (this.#status.create) this.#status.create(...args);
    }

    getSelectedLayer(): Phaser.GameObjects.Container {
        return this.#ui.selectedLayer;
    }

    preUpdate() {
        if (this.#status && this.#status.preUpdate) {
            this.#status.preUpdate();
        }
    }

    move(moves: Move[]): void {
        if (!this.#status) return;
        if (this.#status instanceof MovingState) {
            this.#status.addTweens(moves);
        } else if (this.#status instanceof StaticState) {
            this.#status.moving(moves);
        }
    }

    moveFromTo(config: MoveCardConfig): void {
        const defaultConfig = {
            xFrom: this.getX(),
            yFrom: this.getY(),
        };
        const onComplete = () => {
            if (config.onComplete) config.onComplete();
            this.updateOrigin(this.getX(), this.getY());
        }
        this.move(MovingState.createFromToMove(({
            ...defaultConfig,
            ...config,
            onComplete
        })));
    }

    flip(config?: FlipCardConfig): void {
        this.updateOrigin();
        const onCanStartClose = () => {
            return !this.data.get('faceUp');
        };
        const onComplete = () => {
            this.data.set('faceUp', true);
            this.#ui.setImage(this.data.get('faceUp'));
            this.#ui.setDisplay(this.data.get('ap'), this.data.get('hp'), this.data.get('faceUp'));
        };
        this.close({
            delay: config?.delay || 100, 
            duration: 100, 
            onCanStart: onCanStartClose, 
            onComplete
        });
        const onCanStartOpen = () => {
            return this.data.get('faceUp');
        };
        this.open({
            delay: 100, 
            duration: 100, 
            onCanStart: onCanStartOpen, 
            onComplete: config?.onComplete
        });
    }

    turnDown(): void {
        const onCanStartClose = () => {
            return this.data.get('faceUp');
        };
        const onComplete = () => {
            this.data.set('faceUp', false);
            this.#ui.setImage(this.data.get('faceUp'));
            this.#ui.setDisplay(this.data.get('ap'), this.data.get('hp'), this.data.get('faceUp'));
        };
        this.close({
            delay: 100, 
            duration: 100, 
            onCanStart: onCanStartClose, 
            onComplete
        });
        const onCanStartOpen = () => {
            return !this.data.get('faceUp');
        };
        this.open({
            delay: 100, 
            duration: 100, 
            onCanStart: onCanStartOpen
        });
    }

    close(config: CloseCardConfig): void {
        const onCompleteCallback = () => {
            this.data.set('closed', true);
            if (config?.onComplete) config.onComplete();
        };
        this.move(MovingState.createCloseMove(this, {
            delay: config?.delay || 100, 
            duration: config?.duration || 100, 
            onCanStart: config?.onCanStart, 
            onComplete: onCompleteCallback
        }));
    }

    isOpened(): boolean {
        return !this.data.get('closed');
    }

    isClosed(): boolean {
        return this.data.get('closed');
    }

    open(config: OpenCardConfig): void {
        const onOpenedCallback = () => {
            this.data.set('closed', false);
            if (config.onComplete) config.onComplete(this);
        };
        this.move(MovingState.createOpenMove(this, {
            delay: config?.delay || 100, 
            duration: config?.duration || 100, 
            onCanStart: config?.onCanStart, 
            onComplete: onOpenedCallback
        }));
    }

    expand(config?: ExpandCardConfig): void {
        this.move(MovingState.createExpandMove(this, {
            delay: config?.delay || 200, 
            duration: config?.duration || 200,
            onComplete: config?.onComplete
        }));
    }

    shrink(config?: ExpandCardConfig): void {
        this.move(MovingState.createShrinkMove(this, {
            delay: config?.delay || 200, 
            duration: config?.duration || 200,
            onComplete: config?.onComplete
        }));
    }

    changeDisplayPoints(ap: number, hp: number): void {
        if (!this.#status || !this.data.get('faceUp')) return;
        if (this.#status instanceof UpdatingState) {
            this.#status.addTweens(ap, hp, 2000);
        } else if (this.#status instanceof StaticState) {
            this.#status.updating(ap, hp);
        }
    }

    disable(): void {
        this.data.set('disabled', true);
        if (!this.#ui.disabledLayer) return;
        this.#ui.disabledLayer.setVisible(true);
    }

    enable(): void {
        this.data.set('disabled', false);
        if (!this.#ui.disabledLayer) return;
        this.#ui.disabledLayer.setVisible(false);
    }

    select(): void {
        this.data.set('selected', true);
        this.#ui.changeSelectedLayerColor(0xffff00);
        this.#ui.setSelectedLayerVisible(true);
    }

    deselect(): void {
        this.data.set('selected', false);
        this.#ui.setSelectedLayerVisible(false);
    }

    isSelected(): boolean {
        return this.data.get('selected');
    }

    mark(): void {
        this.data.set('marked', true);
        this.#ui.changeSelectedLayerColor(0x00ff00);
        this.#ui.setSelectedLayerVisible(true);
    }

    isMarked(): boolean {
        return this.data.get('marked');
    }

    unmark(): void {
        this.data.set('marked', false);
        this.#ui.setSelectedLayerVisible(false);
    }

    highlight(): void {
        this.data.set('highlight', true);
        this.#ui.changeSelectedLayerColor(0xff00ff);
        this.#ui.setSelectedLayerVisible(true);
    }

    isHighlighted(): boolean {
        return this.data.get('highlight');
    }

    unhighlight(): void {
        this.data.set('highlight', false);
        this.#ui.setSelectedLayerVisible(false);
    }

    isDisabled(): boolean {
        return this.data.get('disabled');
    }

    getId(): string {
        return this.staticData.id;
    }

    getName(): string {
        return this.staticData.name;
    }

    getDescription(): string {
        return this.staticData.description;
    }

    getDetails(): string {
        return this.staticData.details;
    }

    getColor(): CardColors {
        return this.staticData.color;
    }

    getCost(): number {
        return this.staticData.cost;
    }

    isBattleCard(): boolean {
        return this.staticData.typeId === BATTLE as CardType;
    }

    isPowerCard(): boolean {
        return this.staticData.typeId === POWER as CardType;
    }

    setPosition(x: number = this.#ui.x, y: number = this.#ui.y): void {
        this.#setX(x);
        this.#setY(y);
    }

    #setX(x: number): void {
        this.#ui.x = x;
    }

    #setY(y: number): void {
        this.#ui.y = y;
    }

    updateOrigin(x?: number, y?: number): void {
        this.#setOriginX(x);
        this.#setOriginY(y);
    }

    #setOriginX(value: number = this.#ui.x): void {
        this.data.set('originX', value);
    }

    #setOriginY(value: number = this.#ui.y): void {
        this.data.set('originY', value);
    }

    getX(): number {
        return this.#ui.x;
    }

    getOriginX(): number {
        return this.data.get('originX');
    }

    getY(): number {
        return this.#ui.y;
    }

    getOriginY(): number {
        return this.data.get('originY');
    }

    getWidth(): number {
        return this.#ui.width;
    }

    getHeight(): number {
        return this.#ui.height;
    }

    getBackgroundColor(): number {
        return this.#ui.getBackgroundColor();
    }

    getUi(): CardUi {
        return this.#ui;
    }

    setPointsDisplay(ap: number = 0, hp: number = 0): void {
        this.#ui.setPointsDisplay(ap, hp);
    }

    setAp(ap: number): void {
        this.data.set('ap', ap);
    }

    setHp(hp: number): void {
        this.data.set('hp', hp);
    }

    flash(config: FlashCardConfig): void {
        // this.#status.flash(config);
    }

    setClosed(): void {
        this.data.set('closed', true);
        this.#setX(this.getX() + (this.getWidth() / 2));
        this.setScaleX(0);
    }

    setScaleX(scaleX: number): void {
        this.#ui.scaleX = scaleX;
    }

    _expand(config: ExpandCardConfig = {}): Card {
        this.#addMove([ExpandMove.name, config]);
        return this;
    }

    _flash(config: FlashCardConfig = {}): Card {
        this.#addMove([FlashAnimation.name, config]);
        return this;
    }

    _shrink(config: FlashCardConfig = {}): Card {
        this.#addMove([ShrinkMove.name, config]);
        return this;
    }

    #addMove(moveOrAnimation: CardMove | CardAnimation): void {
        if (this.#moves.length > 0) {
            const [name, config] = this.#moves[this.#moves.length - 1] as CardMove | CardAnimation;
            const onCompleteCopy = config?.onComplete;
            const onComplete = () => {
                if (onCompleteCopy) onCompleteCopy(this);
                this.play(moveOrAnimation)
            };
            config.onComplete = onComplete;
            this.#moves[this.#moves.length - 1] = [name, config];
            this.#moves.push(moveOrAnimation);
            return;
        }
        this.#moves.push(moveOrAnimation);
    }

    play(moveOrAnimation?: CardMove | CardAnimation): void {
        if (this.#moves.length > 0 && !moveOrAnimation) {
            moveOrAnimation = this.#moves[0];
        }
        const [name, config] = moveOrAnimation as CardMove | CardAnimation;
        switch (name) {
            case ExpandMove.name:
                this.#moveState = new ExpandMove(this, config as ExpandCardConfig);
                break;
            case FlashAnimation.name:
                this.#moveState = new FlashAnimation(this, config as FlashCardConfig);
                break;
            case ShrinkMove.name:
                this.#moveState = new ShrinkMove(this, config as ExpandCardConfig);
                break;
            default:
                throw new Error(`Unknown move or animation: ${name}`);
        }
    }

}