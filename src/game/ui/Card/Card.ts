import { CardPoints } from "./types/CardPoints";
import { CardState, StaticState, MovingState, UpdatingState, FlashConfig } from "./state/CardState";
import { CardUi } from "./CardUi";
import { Move } from "./types/Move";
import { CardData } from "@/game/types";
import { Cardset } from "../Cardset/Cardset";
import { FlipConfig } from "./state/MovingState";

export const CARD_WIDTH = 100;
export const CARD_HEIGHT = 150;
export type CardType = 'battle' | 'power';
export type CardColors = 'red' | 'green' | 'blue' | 'black' | 'white' | 'orange';

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
        const onClosed = () => {
            this.data.set('faceUp', true);
            this.#ui.setImage(this.data.get('faceUp'));
            this.#ui.setDisplay(this.data.get('ap'), this.data.get('hp'), this.data.get('faceUp'));
        };
        this.close(config?.delay || 100, 100, onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return this.data.get('faceUp');
        };
        this.#open(100, 100, onCanStartOpen, config?.onComplete);
    }

    turnDown(): void {
        const onCanStartClose = () => {
            return this.data.get('faceUp');
        };
        const onClosed = () => {
            this.data.set('faceUp', false);
            this.#ui.setImage(this.data.get('faceUp'));
            this.#ui.setDisplay(this.data.get('ap'), this.data.get('hp'), this.data.get('faceUp'));
        };
        this.close(100, 100,onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return !this.data.get('faceUp');
        };
        this.#open(100, 100, onCanStartOpen);
    }

    close(delay?: number, duration?: number, onCanStart?: () => boolean, onClosed?: () => void): void {
        const onClosedCallback = () => {
            this.data.set('closed', true);
            if (onClosed) onClosed();
        };
        this.move(MovingState.createCloseMove(this, onCanStart, onClosedCallback, delay, duration));
    }

    isOpened(): boolean {
        return !this.data.get('closed');
    }

    isClosed(): boolean {
        return this.data.get('closed');
    }

    #open(delay: number = 0, duration: number = 0, onCanStart?: () => boolean, onOpened?: (card: Card) => void): void {
        const onOpenedCallback = () => {
            this.data.set('closed', false);
            if (onOpened) onOpened(this);
        };
        this.move(MovingState.createOpenMove(this, onCanStart, onOpenedCallback, delay, duration));
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
        return this.staticData.typeId === 'battle';
    }

    isPowerCard(): boolean {
        return this.staticData.typeId === 'power';
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