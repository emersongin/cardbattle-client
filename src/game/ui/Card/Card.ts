import { AP, BATTLE, HP, POWER } from "@constants/keys";
import { BattlePointsData } from "@/game/objects/BattlePointsData";
import { CardData } from "@objects/CardData";
import { CardColorsType } from "@game/types/CardColorsType";
import { CardType } from "@game/types/CardType";
import { CardUi } from "@ui/Card/CardUi";
import { Cardset } from "@ui/Cardset/Cardset";

export class Card extends Phaser.GameObjects.GameObject {
    #ui: CardUi;

    constructor(
        readonly scene: Phaser.Scene, 
        readonly cardset: Cardset,
        readonly staticData: CardData,
        faceUp: boolean = false
    ) {
        super(scene, 'Card');
        this.#setStartData();
        this.data.set('faceUp', faceUp);
        this.#ui = new CardUi(this.scene, this);
        this.cardset.add(this.#ui);
    }

    getAllData(): BattlePointsData {
        return { [AP]: this.data.get('ap'), [HP]: this.data.get('hp') };
    }

    #setStartData(): void {
        this.setDataEnabled();
        this.updateOrigin();
        this.data.set('ap', this.staticData.ap);
        this.data.set('hp', this.staticData.hp);
        this.data.set('disabled', this.staticData.disabled || false);
        this.data.set('closed', false);
        this.data.set('selected', false);
        this.data.set('marked', false);
        this.data.set('highlight', false);
    }

    getSelectedLayer(): Phaser.GameObjects.Container {
        return this.#ui.selectedLayer;
    }

    isOpened(): boolean {
        return !this.data.get('closed');
    }

    isClosed(): boolean {
        return this.data.get('closed');
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

    ban(): void {
        this.data.set('banned', true);
        this.#ui.changeSelectedLayerColor(0xff0000);
        this.#ui.setSelectedLayerVisible(true);
    }

    unban(): void {
        this.data.set('banned', false);
        this.#ui.setSelectedLayerVisible(false);
    }

    isBanned(): boolean {
        return this.data.get('banned');
    }

    mark(): void {
        this.data.set('marked', true);
        this.#ui.changeSelectedLayerColor(0x00ff00);
        this.#ui.setSelectedLayerVisible(true);
    }

    unmark(): void {
        this.data.set('marked', false);
        this.#ui.setSelectedLayerVisible(false);
    }

    isMarked(): boolean {
        return this.data.get('marked');
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

    getColor(): CardColorsType {
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

    #setOriginX(value: number = this.#ui?.x || 0): void {
        this.data.set('originX', value);
    }

    #setOriginY(value: number = this.#ui?.y || 0): void {
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

    setClosed(): void {
        this.data.set('closed', true);
        this.#setX(this.getX() + (this.getWidth() / 2));
        this.setScaleX(0);
    }

    setScaleX(scaleX: number): void {
        this.#ui.scaleX = scaleX;
    }
}