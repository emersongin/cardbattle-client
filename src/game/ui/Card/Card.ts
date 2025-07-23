import { CardPoints } from "./types/CardPoints";
import { CardState, StaticState, MovingState, UpdatingState, FlashConfig } from "./state/CardState";
import { CardUi } from "./CardUi";
import { Move } from "./types/Move";
import { CardData } from "@game/types";
import { Cardset } from "../Cardset/Cardset";
import { CloseConfig, FlipConfig, OpenConfig } from "./state/MovingState";
import { RED, GREEN, BLUE, BLACK, WHITE, ORANGE } from "@game/constants/Colors";
import { BATTLE, POWER } from "@game/constants/CardTypes";

export const CARD_WIDTH = 100;
export const CARD_HEIGHT = 150;
export type CardType = | typeof BATTLE | typeof POWER;
export type CardColors = 
    | typeof RED 
    | typeof GREEN 
    | typeof BLUE 
    | typeof BLACK 
    | typeof WHITE 
    | typeof ORANGE;

export class Card extends Phaser.GameObjects.GameObject {
    #ui: CardUi;
    #status: CardState;

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
        this.data.set('ap', this.staticData.hp);
        this.data.set('hp', this.staticData.ap);
        this.data.set('faceUp', false);
        this.data.set('closed', false);
        this.data.set('marked', false);
        this.data.set('disabled', false);
    }

    changeState(state: CardState, ...args: any[]): void {
        this.#status = state;
        if (this.#status.create) this.#status.create(...args);
    }

    getSelectedLayer(): Phaser.GameObjects.Graphics {
        return this.#ui.selectedLayer;
    }

    getMarkedLayer(): Phaser.GameObjects.Graphics {
        return this.#ui.markedLayer;
    }

    getHighlightedLayer(): Phaser.GameObjects.Graphics {
        return this.#ui.highlightedLayer;
    }

    preUpdate() {
        if (this.#status && this.#status.preUpdate) {
            this.#status.preUpdate();
        }
    }

    movePosition(xTo: number, yTo: number, delay: number = 0, duration: number = 0): void {
        this.move(MovingState.createPositionMove(xTo, yTo, delay, duration));
    }

    move(moves: Move[], duration?: number): void {
        if (!this.#status) return;
        if (this.#status instanceof MovingState) {
            this.#status.addTweens(moves, duration);
            return;
        };
        if (!(this.#status instanceof StaticState)) return
        this.#status.moving(moves);
    }

    moveFromTo(
        xTo: number, 
        yTo: number, 
        xFrom: number = this.getX(), 
        yFrom: number = this.getY(), 
        delay: number = 0, 
        duration: number = 0
    ): void {
        this.move(MovingState.createFromToMove(xFrom, yFrom, xTo, yTo, delay, duration));
    }

    flip(config: FlipConfig): void {
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
        this.#open({
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
        this.#open({
            delay: 100, 
            duration: 100, 
            onCanStart: onCanStartOpen
        });
    }

    close(config: CloseConfig): void {
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

    #open(config: OpenConfig): void {
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

    changeDisplayPoints(ap: number, hp: number): void {
        if (!this.#status || !this.data.get('faceUp')) return;
        if (this.#status instanceof UpdatingState) {
            this.#status.addTweens(ap, hp, 2000);
            return;
        }
        if (!(this.#status instanceof StaticState)) return;
        this.#status.updating(ap, hp);
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
        if (!this.#ui.selectedLayer) return;
        this.#ui.selectedLayer.setVisible(true);
    }

    isSelected(): boolean {
        return this.#ui.selectedLayer && this.#ui.selectedLayer.visible;
    }

    deselect(): void {
        if (!this.#ui.selectedLayer) return;
        this.#ui.selectedLayer.setVisible(false);
    }

    mark(): void {
        this.data.set('marked', true);
        if (!this.#ui.markedLayer) return;
        this.#ui.markedLayer.setVisible(true);
    }

    isMarked(): boolean {
        return this.data.get('marked');
    }

    unmark(): void {
        this.data.set('marked', false);
        if (!this.#ui.markedLayer) return;
        this.#ui.markedLayer.setVisible(false);
    }

    highlight(): void {
        if (!this.#ui.highlightedLayer) return;
        this.#ui.highlightedLayer.setVisible(true);
    }

    isHighlighted(): boolean {
        return this.#ui.highlightedLayer && this.#ui.highlightedLayer.visible;
    }

    unhighlight(): void {
        if (!this.#ui.highlightedLayer) return;
        this.#ui.highlightedLayer.setVisible(false);
    }

    isDisabled(): boolean {
        return this.data.get('disabled');
    }

    getName(): string {
        return this.staticData.name;
    }

    getColor(): CardColors {
        return this.staticData.color;
    }

    getCost(): number {
        return this.staticData.cost;
    }

    isBattleCard(): boolean {
        return this.staticData.typeId === BATTLE;
    }

    isPowerCard(): boolean {
        return this.staticData.typeId === POWER;
    }

    setPosition(x: number, y: number): void {
        this.setX(x);
        this.setY(y);
    }

    setX(x: number): void {
        this.#ui.x = x;
    }

    getX(): number {
        return this.#ui.x;
    }

    setY(y: number): void {
        this.#ui.y = y;
    }

    getY(): number {
        return this.#ui.y;
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

    flash(config: FlashConfig): void {
        if (!this.#status) return;
        if (!(this.#status instanceof StaticState)) return;
        this.#status.flash(config);
    }
}