import { CardPoints } from "./types/CardPoints";
import { CardState, StaticState, MovingState, UpdatingState, FlashConfig } from "./state/CardState";
import { CardUi } from "./CardUi";
import { Move } from "./types/Move";
import { CardData } from "@/game/types";
import { Cardset } from "../Cardset/Cardset";

export const CARD_WIDTH = 100;
export const CARD_HEIGHT = 150;
export type CardType = 'battle' | 'power';
export type CardColors = 'red' | 'green' | 'blue' | 'black' | 'white' | 'orange';

export class Card {
    #ui: CardUi;
    #status: CardState;
    #data: CardData; 
    #ap: number = 0;
    #hp: number = 0;
    #faceUp: boolean = false;
    #closed: boolean = false;
    #marked: boolean = false;
    #disabled: boolean = false;

    constructor(
        readonly scene: Phaser.Scene, 
        readonly cardset: Cardset,
        cardData: CardData
    ) {
        this.#ui = new CardUi(this.scene, cardData);
        this.#data = cardData;
        this.#setPoints();
        this.changeState(new StaticState(this));
        this.cardset.add(this.#ui);
    }

    getAllData(): CardPoints {
        return { ap: this.#ap, hp: this.#hp };
    }

    #setPoints(): void {
        this.#ap = this.#data.hp;
        this.#hp = this.#data.ap;
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

    flip(): void {
        const onCanStartClose = () => {
            return !this.#faceUp;
        };
        const onClosed = () => {
            this.#faceUp = true;
            this.#ui.setImage(this.#faceUp);
            this.#ui.setDisplay(this.#faceUp, this.#ap, this.#hp);
        };
        this.close(100, 100, onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return this.#faceUp;
        };
        this.#open(100, 100, onCanStartOpen);
    }

    turnDown(): void {
        const onCanStartClose = () => {
            return this.#faceUp;
        };
        const onClosed = () => {
            this.#faceUp = false;
            this.#ui.setImage(this.#faceUp);
            this.#ui.setDisplay(this.#faceUp);
        };
        this.close(100, 100,onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return !this.#faceUp;
        };
        this.#open(100, 100, onCanStartOpen);
    }

    close(delay?: number, duration?: number, onCanStart?: () => boolean, onClosed?: () => void): void {
        const onClosedCallback = () => {
            this.#closed = true;
            if (onClosed) onClosed();
        };
        this.move(MovingState.createCloseMove(this, onCanStart, onClosedCallback, delay, duration));
    }

    isOpened(): boolean {
        return !this.#closed;
    }

    isClosed(): boolean {
        return this.#closed;
    }

    #open(delay: number = 0, duration: number = 0, onCanStart?: () => boolean, onOpened?: () => void): void {
        const onOpenedCallback = () => {
            this.#closed = false;
            if (onOpened) onOpened();
        };
        this.move(MovingState.createOpenMove(this, onCanStart, onOpenedCallback, delay, duration));
    }

    changeDisplayPoints(ap: number, hp: number): void {
        if (!this.#status || !this.#faceUp) return;
        if (this.#status instanceof UpdatingState) {
            this.#status.addTweens(ap, hp, 2000);
            return;
        }
        if (!(this.#status instanceof StaticState)) return;
        this.#status.updating(ap, hp);
    }

    disable(): void {
        this.#disabled = true;
        if (!this.#ui.disabledLayer) return;
        this.#ui.disabledLayer.setVisible(true);
    }

    enable(): void {
        this.#disabled = false;
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
        this.#marked = true;
        if (!this.#ui.markedLayer) return;
        this.#ui.markedLayer.setVisible(true);
    }

    isMarked(): boolean {
        return this.#marked;
    }

    unmark(): void {
        this.#marked = false;
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
        return this.#disabled;
    }

    getName(): string {
        return this.#data.name;
    }

    getColor(): CardColors {
        return this.#data.color;
    }

    getCost(): number {
        return this.#data.cost;
    }

    isBattleCard(): boolean {
        return this.#data.typeId === 'battle';
    }

    isPowerCard(): boolean {
        return this.#data.typeId === 'power';
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

    getUi(): CardUi {
        return this.#ui;
    }

    setPointsDisplay(ap: number = 0, hp: number = 0): void {
        this.#ui.setPointsDisplay(ap, hp);
    }

    setAp(ap: number): void {
        this.#ap = ap;
    }

    setHp(hp: number): void {
        this.#hp = hp;
    }

    flash(config: FlashConfig): void {
        if (!this.#status) return;
        if (!(this.#status instanceof StaticState)) return;
        this.#status.flash(config);
    }
}