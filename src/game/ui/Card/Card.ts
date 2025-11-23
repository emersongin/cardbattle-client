import { BANNED, CLOSED, DISABLED, FACE_UP, HIGHLIGHTED, MARKED, ORIGIN_X, ORIGIN_Y, SELECTED } from "@constants/keys";
import { CardType } from "@game/types/CardType";
import { CardUi } from "@ui/Card/CardUi";
import { CardColorType } from "@game/types/CardColorType";
import { CardData } from "@game/objects/CardData";
import { VueScene } from "@game/scenes/VueScene";
export class Card {
    #data: Phaser.Data.DataManager; // Phaser.GameObjects.GameObject
    #ui: CardUi;
    
    constructor(
        readonly scene: VueScene,
        readonly staticData: CardData,
        isStartFaceUp: boolean = false,
        isStartDisabled: boolean = false
    ) {
        this.setStartData();
        this.#ui = new CardUi(this.scene, this);
        this.setData(FACE_UP, isStartFaceUp || false);
        this.setData(DISABLED, isStartDisabled || false);
        this.setPosition();
        this.setDisplay();
    }

    protected getData(key: string): any {
        return this.#data.get(key);
    }

    protected setData(key: string, data: any): void {
        this.#data.set(key, data);
    }

    setStartData(): void {
        this.#data = new Phaser.Data.DataManager({ sys: this.scene }, new Phaser.Events.EventEmitter());
        // this.#data.setDataEnabled();
        this.setData(CLOSED, false);
        this.setData(SELECTED, false);
        this.setData(MARKED, false);
        this.setData(HIGHLIGHTED, false);
        this.setData(BANNED, false);
        this.setData(ORIGIN_X, 0);
        this.setData(ORIGIN_Y, 0);
    }

    setPosition(x?: number, y?: number): void {
        this.#setOriginX(x);
        this.#setOriginY(y);
        this.setX(x);
        this.setY(y);
    }

    setX(x: number = this.getX()): void {
        this.#ui.setX(x);
    }

    setY(y: number = this.getY()): void {
        this.#ui.setY(y);
    }

    #setOriginX(value: number = this.getX()): void {
        this.setData(ORIGIN_X, value);
    }

    #setOriginY(value: number = this.getY()): void {
        this.setData(ORIGIN_Y, value);
    }

    setOpened(): void {
        this.setData(CLOSED, false);
        this.setX(this.getOriginX());
        this.setScaleX(1);
    }

    setClosed(): void {
        this.setData(CLOSED, true);
        this.setX(this.getOriginX() + (this.getWidth() / 2));
        this.setScaleX(0);
    }

    setShrinked(): void {
        this.setX(this.getX() + (this.getWidth() / 2));
        this.setY(this.getY() + (this.getHeight() / 2));
        this.setScaleX(0);
        this.setScaleY(0);
    }

    isOpened(): boolean {
        return !this.getData(CLOSED);
    }

    isClosed(): boolean {
        return this.getData(CLOSED);
    }

    isSelected(): boolean {
        return this.getData(SELECTED);
    }

    isBanned(): boolean {
        return this.getData(BANNED);
    }

    isMarked(): boolean {
        return this.getData(MARKED);
    }

    isHighlighted(): boolean {
        return this.getData(HIGHLIGHTED);
    }

    isEnabled(): boolean {
        return !this.getData(DISABLED);
    }

    isDisabled(): boolean {
        return this.getData(DISABLED);
    }

    isFaceUp(): boolean {
        return this.getData(FACE_UP);
    }

    isFaceDown(): boolean {
        return !this.getData(FACE_UP);
    }

    isDisabledLayerVisible(): boolean {
        return this.#ui.isDisabledLayerVisible();
    }

    isSelectedLayerVisible(): boolean {
        return this.#ui.getSelectedLayer().visible;
    }

    enable(): void {
        this.setData(DISABLED, false);
        this.#ui.setDisabledLayerVisible(false);
    }

    disable(): void {
        this.setData(DISABLED, true);
        this.#ui.setDisabledLayerVisible(true);
    }

    faceUp(): void {
        this.setData(FACE_UP, true);
        this.#setFront();
        this.setDisplay();
    }

    #setFront(): void {
        this.#ui.setImage(this.staticData.image);
    }

    faceDown(): void {
        this.setData(FACE_UP, false);
        this.#setBack();
        this.setDisplay();
    }

    #setBack(): void {
        this.#ui.setImage('cardback');
    }

    setDisplay(text: string = ''): void {
        if (!this.isFaceUp()) {
            this.#ui.setDisplayText('');
            return;
        }
        this.#ui.setDisplayText(text);
    }

    select(): void {
        this.setData(SELECTED, true);
        this.#ui.changeSelectedLayerColor(0xffff00);
        this.#ui.setSelectedLayerVisible(true);
    }

    deselect(): void {
        this.setData(SELECTED, false);
        this.#ui.setSelectedLayerVisible(false);
    }

    ban(): void {
        this.setData(BANNED, true);
        this.#ui.changeSelectedLayerColor(0xff0000);
        this.#ui.setSelectedLayerVisible(true);
    }

    unban(): void {
        this.setData(BANNED, false);
        this.#ui.setSelectedLayerVisible(false);
    }

    mark(): void {
        this.setData(MARKED, true);
        this.#ui.changeSelectedLayerColor(0x00ff00);
        this.#ui.setSelectedLayerVisible(true);
    }

    unmark(): void {
        this.setData(MARKED, false);
        this.#ui.setSelectedLayerVisible(false);
    }

    highlight(): void {
        this.setData(HIGHLIGHTED, true);
        this.#ui.changeSelectedLayerColor(0xff00ff);
        this.#ui.setSelectedLayerVisible(true);
    }

    unhighlight(): void {
        this.setData(HIGHLIGHTED, false);
        this.#ui.setSelectedLayerVisible(false);
    }

    getId(): string {
        return this.staticData.id;
    }

    getNumber(): number {
        return this.staticData.number;
    }

    getName(): string {
        return this.staticData.name;
    }

    getDescription(): string {
        return this.staticData.description;
    }

    getColor(): CardColorType {
        return this.staticData.color;
    }

    getImage(): string {
        return this.staticData.image;
    }

    getType(): CardType {
        return this.staticData.type;
    }

    getOriginX(): number {
        return this.getData(ORIGIN_X);
    }

    getOriginY(): number {
        return this.getData(ORIGIN_Y);
    }
    
    getUi(): CardUi {
        return this.#ui;
    }

    getX(): number {
        return this.#ui.getX() || 0;
    }

    getY(): number {
        return this.#ui.getY() || 0;
    }

    getWidth(): number {
        return this.#ui.getWidth();
    }

    getHeight(): number {
        return this.#ui.getHeight();
    }

    getScaleX(): number {
        return this.#ui.getScaleX();
    }

    getScaleY(): number {
        return this.#ui.getScaleY();
    }

    getBackgroundColor(): number {
        return this.#ui.getBackgroundColor();
    }

    getSelectedLayer(): Phaser.GameObjects.Container {
        return this.#ui.getSelectedLayer();
    }

    getSelectedLayerColor(): number {
        return this.#ui.getSelectedLayerColor();
    }

    setScaleX(scaleX: number): void {
        this.#ui.setScaleX(scaleX);
    }

    setScaleY(scaleY: number): void {
        this.#ui.setScaleY(scaleY);
    }

    destroy(): void {
        this.#ui.destroy();
        this.#data.destroy();
    }
}