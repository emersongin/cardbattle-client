import { CardData } from "../CardData";
import { CardState, StaticState, MovingState, UpdatingState } from "./CardState";

const CARD_WIDTH = 100;
const CARD_HEIGHT = 150;

export class Card extends Phaser.GameObjects.Container {
    #background: Phaser.GameObjects.Rectangle;
    #image: Phaser.GameObjects.Image;
    #display: Phaser.GameObjects.Text;
    #disabledLayer: Phaser.GameObjects.Rectangle;
    #selectedLayer: Phaser.GameObjects.Graphics;
    #selectedTweens: Phaser.Tweens.Tween;
    #marked: boolean = false;
    #markedLayer: Phaser.GameObjects.Graphics;
    #markedTweens: Phaser.Tweens.Tween;
    #highlightedLayer: Phaser.GameObjects.Graphics;
    #highlightedTweens: Phaser.Tweens.Tween;
    #status: CardState;
    #faceUp: boolean = true;
    #closed: boolean = false;
    #disabled: boolean = false;
    #cardData: CardData;

    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number, 
        cardData: CardData,
    ) {
        super(scene, x, y);
        this.#cardData = cardData;
        this.width = CARD_WIDTH;
        this.height = CARD_HEIGHT;
        this.setPoints();
        this.createLayers();
        this.changeState(new StaticState(this));
        this.scene.add.existing(this);
    }

    static create(scene: Phaser.Scene, cardData: CardData): Card {
        return new Card(scene, 100, 100, cardData);
    }

    private createLayers(): void {
        this.createBackground();
        this.createImage();
        this.createDisplay();
        this.createDisabledLayer();
        this.createSelectedLayer();
        this.createMarkedLayer();
        this.createHighlightedLayer();
    }

    private createBackground(): void {
        const backgroundColor = this.getBackgroundColor();
        const backgroundRect = this.scene.add.rectangle(0, 0, this.width, this.height, backgroundColor);
        backgroundRect.setOrigin(0, 0);
        this.#background = backgroundRect;
        this.add(this.#background);
    }

    private getBackgroundColor(): number {
        switch (this.#cardData.color) {
            case 'red':
                return 0xff0000; // Red
            case 'blue':
                return 0x0000ff; // Blue
            case 'green':
                return 0x00ff00; // Green
            case 'white':
                return 0xffffff; // White
            case 'black':
                return 0x000000; // Black
            case 'orange':
                return 0xffa500; // Orange
            default:
                throw new Error(`Unknown color: ${this.#cardData.color}`);
        }
    }

    private createImage(): void {
        const image = this.scene.add.image(0, 0, 'empty');
        this.#image = image;
        this.setImage();
        this.add(this.#image);
    }

    private setImage() {
        if (this.#faceUp) {
            this.#image.setTexture(this.#cardData.imageName);
        } else {
            this.#image.setTexture('card-back');
        }
        this.adjustImagePosition();
    }

    private adjustImagePosition(): void {
        const larguraDesejada = CARD_WIDTH - 12;
        const alturaDesejada = CARD_HEIGHT - 12;
        const escalaX = larguraDesejada / this.#image.width;
        const escalaY = alturaDesejada / this.#image.height;
        const escalaProporcional = Math.min(escalaX, escalaY);
        this.#image.setOrigin(0, 0);
        this.#image.setScale(escalaProporcional);
        this.#image.setPosition((this.width - this.#image.displayWidth) / 2, (this.height - this.#image.displayHeight) / 2);
    }

    private createDisplay(): void {
        const display = this.scene.add.text(this.width - 80, this.height - 32, '', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
        });
        this.#display = display;
        this.#display.setOrigin(0, 0);
        this.setDisplay();
        this.add(this.#display);
    }

    private setDisplay() {
        if (!this.#display || !this.#faceUp) {
            this.setEmptyDisplay();
            return
        } 
        const { typeId: cardTypeId } = this.#cardData;
        if (cardTypeId === 'battle') {
            this.setPointsDisplay();
        } else if (cardTypeId === 'power') {
            this.setPowerDisplay();
        } else {
            throw new Error(`Unknown card type id: ${cardTypeId}`);
        }
    }

    private setEmptyDisplay() {
        this.setDisplayText('');
    }

    public setDisplayText(text: string): void {
        if (!this.#display) {
            throw new Error('Display is not initialized.');
        }
        this.#display.setText(text);
    }

    private setPointsDisplay() {
        const { ap, hp } = this.getAllData('ap', 'hp');
        const apText = ap.toString().padStart(2, "0"); 
        const hpText = hp.toString().padStart(2, "0");
        this.setDisplayText(`${apText}/${hpText}`);
    }

    getAllData(...keys: string[]): any {
        const result: any = {};
        keys.forEach(key => {
            const data = this.getData(key);
            if (data !== undefined) {
                result[key] = data;
            } else {
                throw new Error(`Key "${key}" not found in card data.`);
            }
        });
        return result;
    }

    private setPowerDisplay() {
        this.setDisplayText('P');
    }

    private setPoints(): void {
        this.setData('hp', this.#cardData.hp);
        this.setData('ap', this.#cardData.ap);
    }

    private createDisabledLayer(): void {
        const disabledLayer = this.scene.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.6);
        disabledLayer.setOrigin(0, 0);
        disabledLayer.setVisible(false);
        this.#disabledLayer = disabledLayer;
        this.add(this.#disabledLayer);
    }

    private createSelectedLayer(): void {
        const selectedLayer = this.createOutlinedRect(0, 0, this.width, this.height, 0xffff00, 6);
        selectedLayer.setVisible(false);
        this.#selectedLayer = selectedLayer;
        this.add(this.#selectedLayer);
    }

    createOutlinedRect(x: number, y: number, w: number, h: number, color = 0xffffff, thickness = 2) {
        const g = this.scene.add.graphics();
        g.lineStyle(thickness, color);
        g.strokeRect(x, y, w, h);
        return g;
    }

    private createMarkedLayer(): void {
        const markedLayer = this.createOutlinedRect(0, 0, this.width, this.height, 0x00ff00, 6);
        markedLayer.setVisible(false);
        this.#markedLayer = markedLayer;
        this.add(this.#markedLayer);
    }

    private createHighlightedLayer(): void {
        const highlightedLayer = this.createOutlinedRect(0, 0, this.width, this.height, 0xff00ff, 6);
        highlightedLayer.setVisible(false);
        this.#highlightedLayer = highlightedLayer;
        this.add(this.#highlightedLayer);
    }

    changeState(state: CardState, ...args: any[]): void {
        this.#status = state;
        this.#status.create(...args);
    }

    preUpdate() {
        if (!this.#status) return;
        this.#status.update();
        if (this.#selectedLayer && this.#selectedLayer.visible && !this.#selectedTweens?.isPlaying()) {
            this.#selectedTweens = this.scene.tweens.add({
                targets: this.#selectedLayer,
                alpha: { from: 0.4, to: 0.9 },
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1,
            });
        }
        if (this.#marked && this.#markedLayer && this.#markedLayer.visible && !this.#markedTweens?.isPlaying()) {
            this.#markedTweens = this.scene.tweens.add({
                targets: this.#markedLayer,
                alpha: { from: 0.7, to: 0.9 },
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1,
            });
        }
        if (this.#highlightedLayer && this.#highlightedLayer.visible && !this.#highlightedTweens?.isPlaying()) {
            this.#highlightedTweens = this.scene.tweens.add({
                targets: this.#highlightedLayer,
                alpha: { from: 0.4, to: 0.9 },
                duration: 500,
                ease: 'Linear',
                yoyo: true,
                repeat: -1,
            });
        }
    }

    // Move methods
    movePosition(xTo: number, yTo: number): void {
        this.changeState(new MovingState(this));
        if (!(this.#status instanceof MovingState)) return;
        this.#status.movePosition(xTo, yTo);
    }

    moveFromTo(xFrom: number, yFrom: number, xTo: number, yTo: number, duration: number): void {
        this.changeState(new MovingState(this));
        if (!(this.#status instanceof MovingState)) return;
        this.#status.moveFromTo(xFrom, yFrom, xTo, yTo, duration);
    }

    // Open and close methods
    flip(): void {
        const onCanStartClose = () => {
            return !this.#faceUp;
        };
        const onClosed = () => {
            this.#faceUp = true;
            this.setImage();
            this.setDisplay();
        };
        this.close(onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return this.#faceUp;
        };
        this.open(onCanStartOpen);
    }

    turnDown(): void {
        const onCanStartClose = () => {
            return this.#faceUp;
        };
        const onClosed = () => {
            this.#faceUp = false;
            this.setImage();
            this.setDisplay();
        };
        this.close(onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return !this.#faceUp;
        };
        this.open(onCanStartOpen);
    }

    private close(onCanStart?: () => boolean, onClosed?: () => void): void {
        this.changeState(new MovingState(this));
        if (!(this.#status instanceof MovingState)) return;
        this.#status.close(onCanStart, () => {
            this.#closed = true;
            if (onClosed) onClosed();
        });
    }

    isOpened(): boolean {
        return !this.#closed;
    }

    isClosed(): boolean {
        return this.#closed;
    }

    private open(onCanStart?: () => boolean, onOpened?: () => void): void {
        this.changeState(new MovingState(this));
        if (!(this.#status instanceof MovingState)) return;
        this.#status.open(onCanStart, () => {
            this.#closed = false;
            if (onOpened) onOpened();
        });
    }

    // Update points methods
    changeDisplayPoints(ap: number, hp: number): void {
        if (!this.#status || !this.#faceUp) return;
        if (this.#status instanceof UpdatingState) {
            this.#status.addTweens(ap, hp, 2000);
            return;
        }
        this.changeState(new UpdatingState(this), ap, hp, 1000);
    }

    // Disable methods
    disable(): void {
        this.#disabled = true;
        if (!this.#disabledLayer) return;
        this.#disabledLayer.setVisible(true);
    }

    enable(): void {
        this.#disabled = false;
        if (!this.#disabledLayer) return;
        this.#disabledLayer.setVisible(false);
    }

    // Select methods
    select(): void {
        if (!this.#selectedLayer) return;
        this.#selectedLayer.setVisible(true);
    }

    deselect(): void {
        if (!this.#selectedLayer) return;
        this.#selectedLayer.setVisible(false);
        if (this.#selectedTweens) this.#selectedTweens.stop();
    }

    // Mark methods
    mark(): void {
        this.#marked = true;
        if (!this.#markedLayer) return;
        this.#markedLayer.setVisible(true);
    }

    unmark(): void {
        this.#marked = false;
        if (!this.#markedLayer) return;
        this.#markedLayer.setVisible(false);
        if (this.#markedTweens) this.#markedTweens.stop();
    }

    // Highlight methods
    highlight(): void {
        if (!this.#highlightedLayer) return;
        this.#highlightedLayer.setVisible(true);
    }

    unhighlight(): void {
        if (!this.#highlightedLayer) return;
        this.#highlightedLayer.setVisible(false);
        if (this.#highlightedTweens) this.#highlightedTweens.stop();
    }

    isDisabled(): boolean {
        return this.#disabled;
    }

    getName(): string {
        return this.#cardData.name;
    }
}