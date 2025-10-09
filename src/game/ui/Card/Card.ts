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
        this.setPosition();
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

    setPosition(x?: number, y?: number): void {
        this.#setOriginX(x);
        this.#setOriginY(y);
        this.setX(x);
        this.setY(y);
    }

    setX(x: number = this.getX()): void {
        this.#ui.x = x;
    }

    setY(y: number = this.getY()): void {
        this.#ui.y = y;
    }

    #setOriginX(value: number = this.getX()): void {
        this.data.set(ORIGIN_X, value);
    }

    #setOriginY(value: number = this.getY()): void {
        this.data.set(ORIGIN_Y, value);
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

    isEnabled(): boolean {
        return !this.data.get(DISABLED);
    }

    isDisabled(): boolean {
        return this.data.get(DISABLED);
    }

    isFaceUp(): boolean {
        return this.data.get(FACE_UP);
    }

    isFaceDown(): boolean {
        return !this.data.get(FACE_UP);
    }

    isDisabledLayerVisible(): boolean {
        return this.#ui.isDisabledLayerVisible();
    }

    isSelectedLayerVisible(): boolean {
        return this.#ui.getSelectedLayer().visible;
    }

    enable(): void {
        this.data.set(DISABLED, false);
        this.#ui.setDisabledLayerVisible(false);
    }

    disable(): void {
        this.data.set(DISABLED, true);
        this.#ui.setDisabledLayerVisible(true);
    }

    faceUp(): void {
        this.data.set(FACE_UP, true);
        this.#setImage();
        this.setDisplay();
    }

    faceDown(): void {
        this.data.set(FACE_UP, false);
        this.#setImage();
        this.setDisplay();
    }

    #setImage(): void {
        if (this.isFaceUp()) {
            this.#ui.setImage(this.staticData.image);
            return;
        }
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
        return this.#ui.getSelectedLayer();
    }

    getSelectedLayerColor(): number {
        return this.#ui.getSelectedLayerColor();
    }

    setScaleX(scaleX: number): void {
        this.#ui.scaleX = scaleX;
    }

    setScaleY(scaleY: number): void {
        this.#ui.scaleY = scaleY;
    }
}