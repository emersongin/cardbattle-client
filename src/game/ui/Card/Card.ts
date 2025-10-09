import { BANNED, CLOSED, DISABLED, FACE_UP, HIGHLIGHTED, MARKED, ORIGIN_X, ORIGIN_Y, SELECTED } from "@constants/keys";
import { CardType } from "@game/types/CardType";
import { CardUi } from "@ui/Card/CardUi";
import { CardColorType } from "@game/types/CardColorType";
import { CardData } from "@game/objects/CardData";
import { VueScene } from "@game/scenes/VueScene";
export class Card extends Phaser.GameObjects.GameObject {
    public readonly staticData: Readonly<CardData>;
    #ui: CardUi;

    constructor(
        readonly scene: VueScene,
        staticData: CardData,
        isStartFaceUp: boolean = false,
        isStartDisabled: boolean = false
    ) {
        super(scene, Card.name);
        this.#setStartData();
        this.staticData = Object.freeze({ ...staticData });
        this.#ui = new CardUi(this.scene, this);
        this.data.set(FACE_UP, isStartFaceUp || false);
        this.data.set(DISABLED, isStartDisabled || false);
        this.setOrigin();
        this.setDisplay();
    }

    #setStartData(): void {
        this.setDataEnabled();
        this.data.set(CLOSED, false);
        this.data.set(SELECTED, false);
        this.data.set(MARKED, false);
        this.data.set(HIGHLIGHTED, false);
        this.data.set(BANNED, false);
        this.data.set(ORIGIN_X, 0);
        this.data.set(ORIGIN_Y, 0);
    }

    setOrigin(x?: number, y?: number): void {
        this.#setOriginX(x);
        this.#setOriginY(y);
    }

    #setOriginX(value: number = this.getX()): void {
        this.data.set(ORIGIN_X, value);
        this.setX(value);
    }

    #setOriginY(value: number = this.getY()): void {
        this.data.set(ORIGIN_Y, value);
        this.setY(value);
    }

    setOpened(): void {
        this.data.set(CLOSED, false);
        this.setX(this.getOriginX());
        this.setScaleX(1);
    }

    setClosed(): void {
        this.data.set(CLOSED, true);
        this.setX(this.getOriginX() + (this.getWidth() / 2));
        this.setScaleX(0);
    }

    isOpened(): boolean {
        return !this.data.get(CLOSED);
    }

    isClosed(): boolean {
        return this.data.get(CLOSED);
    }

    isSelected(): boolean {
        return this.data.get(SELECTED);
    }

    isBanned(): boolean {
        return this.data.get(BANNED);
    }

    isMarked(): boolean {
        return this.data.get(MARKED);
    }

    isHighlighted(): boolean {
        return this.data.get(HIGHLIGHTED);
    }

    isDisabled(): boolean {
        return this.data.get(DISABLED);
    }

    isFaceUp(): boolean {
        return this.data.get(FACE_UP);
    }

    enable(): void {
        if (!this.#ui.disabledLayer) return;
        this.data.set(DISABLED, false);
        this.#ui.disabledLayer.setVisible(false);
    }

    disable(): void {
        if (!this.#ui.disabledLayer) return;
        this.data.set(DISABLED, true);
        this.#ui.disabledLayer.setVisible(true);
    }

    select(): void {
        this.data.set(SELECTED, true);
        this.#ui.changeSelectedLayerColor(0xffff00);
        this.#ui.setSelectedLayerVisible(true);
    }

    deselect(): void {
        this.data.set(SELECTED, false);
        this.#ui.setSelectedLayerVisible(false);
    }

    ban(): void {
        this.data.set(BANNED, true);
        this.#ui.changeSelectedLayerColor(0xff0000);
        this.#ui.setSelectedLayerVisible(true);
    }

    unban(): void {
        this.data.set(BANNED, false);
        this.#ui.setSelectedLayerVisible(false);
    }

    mark(): void {
        this.data.set(MARKED, true);
        this.#ui.changeSelectedLayerColor(0x00ff00);
        this.#ui.setSelectedLayerVisible(true);
    }

    unmark(): void {
        this.data.set(MARKED, false);
        this.#ui.setSelectedLayerVisible(false);
    }

    faceUp(): void {
        this.data.set(FACE_UP, true);
        this.setImage();
        this.setDisplay();
    }

    faceDown(): void {
        this.data.set(FACE_UP, false);
        this.setImage();
        this.setDisplay();
    }

    highlight(): void {
        this.data.set(HIGHLIGHTED, true);
        this.#ui.changeSelectedLayerColor(0xff00ff);
        this.#ui.setSelectedLayerVisible(true);
    }

    unhighlight(): void {
        this.data.set(HIGHLIGHTED, false);
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
        return this.data.get(ORIGIN_X);
    }

    getOriginY(): number {
        return this.data.get(ORIGIN_Y);
    }
    
    getUi(): CardUi {
        return this.#ui;
    }

    getX(): number {
        return this.#ui.x || 0;
    }

    getY(): number {
        return this.#ui.y || 0;
    }

    getWidth(): number {
        return this.#ui.width;
    }

    getHeight(): number {
        return this.#ui.height;
    }

    getScaleX(): number {
        return this.#ui.scaleX;
    }

    getScaleY(): number {
        return this.#ui.scaleY;
    }

    getBackgroundColor(): number {
        return this.#ui.getBackgroundColor();
    }

    getSelectedLayer(): Phaser.GameObjects.Container {
        return this.#ui.selectedLayer;
    }

    setPosition(x: number = this.#ui.x, y: number = this.#ui.y): void {
        this.setX(x);
        this.setY(y);
    }

    setX(x: number): void {
        this.#ui.x = x;
    }

    setY(y: number): void {
        this.#ui.y = y;
    }

    setScaleX(scaleX: number): void {
        this.#ui.scaleX = scaleX;
    }

    setScaleY(scaleY: number): void {
        this.#ui.scaleY = scaleY;
    }

    setDisplay(text: string = ''): void {
        if (!this.data.get(FACE_UP)) {
            this.#ui.setDisplayText('');
            return;
        }
        this.#ui.setDisplayText(text);
    }

    setImage(): void {
        if (this.isFaceUp()) {
            this.#ui.setImage(this.staticData.image);
            return;
        }
        this.#ui.setImage('cardback');
    }
}