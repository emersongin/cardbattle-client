import { CardData } from "../CardData";
import { CARD_HEIGHT, CARD_WIDTH } from "./Card";

export class CardUi extends Phaser.GameObjects.Container {
    #data: CardData; 
    background: Phaser.GameObjects.Rectangle;
    image: Phaser.GameObjects.Image;
    display: Phaser.GameObjects.Text;
    disabledLayer: Phaser.GameObjects.Rectangle;
    selectedLayer: Phaser.GameObjects.Graphics;
    markedLayer: Phaser.GameObjects.Graphics;
    highlightedLayer: Phaser.GameObjects.Graphics;

    constructor(
        scene: Phaser.Scene,
        data: CardData,
    ) {
        super(scene);
        this.#data = data;
        this.setSize(CARD_WIDTH, CARD_HEIGHT);
        this.#createLayers();
    }

    #createLayers(): void {
        this.#createBackground();
        this.#createImage();
        this.#createDisplay();
        this.#createDisabledLayer();
        this.#createSelectedLayer();
        this.#createMarkedLayer();
        this.#createHighlightedLayer();
    }

    #createBackground(): void {
        const backgroundColor = this.#getBackgroundColor();
        const backgroundRect = this.scene.add.rectangle(0, 0, this.width, this.height, backgroundColor);
        backgroundRect.setOrigin(0, 0);
        this.background = backgroundRect;
        this.add(this.background);
    }

    #getBackgroundColor(): number {
        switch (this.#data.color) {
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
                throw new Error(`Unknown color: ${this.#data.color}`);
        }
    }

    #createImage(): void {
        const image = this.scene.add.image(0, 0, 'empty');
        this.image = image;
        this.setImage(true);
        this.add(this.image);
    }

    setImage(faceUp: boolean = false): void {
        if (faceUp) {
            this.image.setTexture(this.#data.imageName);
        } else {
            this.image.setTexture('card-back');
        }
        this.#adjustImagePosition();
    }

    #adjustImagePosition(): void {
        const larguraDesejada = CARD_WIDTH - 12;
        const alturaDesejada = CARD_HEIGHT - 12;
        const escalaX = larguraDesejada / this.image.width;
        const escalaY = alturaDesejada / this.image.height;
        const escalaProporcional = Math.min(escalaX, escalaY);
        this.image.setOrigin(0, 0);
        this.image.setScale(escalaProporcional);
        this.image.setPosition((this.width - this.image.displayWidth) / 2, (this.height - this.image.displayHeight) / 2);
    }

    #createDisplay(): void {
        const display = this.scene.add.text(this.width - 80, this.height - 32, '', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
        });
        this.display = display;
        this.setDisplay(true, this.#data.ap, this.#data.hp);
        this.add(this.display);
    }

    setDisplay(faceUp: boolean = false, ap?: number, hp?: number): void {
        if (!this.display || !faceUp) {
            this.#setEmptyDisplay();
            return
        } 
        const { typeId: cardTypeId } = this.#data;
        if (cardTypeId === 'battle') {
            this.setPointsDisplay(ap, hp);
        } else if (cardTypeId === 'power') {
            this.#setPowerDisplay();
        } else {
            throw new Error(`Unknown card type id: ${cardTypeId}`);
        }
    }

    #setEmptyDisplay() {
        this.#setDisplayText('');
    }

    #setDisplayText(text: string): void {
        if (!this.display) {
            throw new Error('Display is not initialized.');
        }
        this.display.setText(text);
    }

    setPointsDisplay(ap: number = 0, hp: number = 0): void {
        const apText = ap.toString().padStart(2, "0"); 
        const hpText = hp.toString().padStart(2, "0");
        this.#setDisplayText(`${apText}/${hpText}`);
    }

    #setPowerDisplay() {
        this.#setDisplayText('P');
    }

    #createDisabledLayer(): void {
        const disabledLayer = this.scene.add.rectangle(0, 0, this.width, this.height, 0x000000, 0.6);
        disabledLayer.setOrigin(0, 0);
        disabledLayer.setVisible(false);
        this.disabledLayer = disabledLayer;
        this.add(this.disabledLayer);
    }

    #createSelectedLayer(): void {
        const selectedLayer = this.#createOutlinedRect(0, 0, this.width, this.height, 0xffff00, 6);
        selectedLayer.setVisible(false);
        this.selectedLayer = selectedLayer;
        this.add(this.selectedLayer);
    }

    #createOutlinedRect(x: number, y: number, w: number, h: number, color = 0xffffff, thickness = 2) {
        const g = this.scene.add.graphics();
        g.lineStyle(thickness, color);
        g.strokeRect(x, y, w, h);
        return g;
    }

    #createMarkedLayer(): void {
        const markedLayer = this.#createOutlinedRect(0, 0, this.width, this.height, 0x00ff00, 6);
        markedLayer.setVisible(false);
        this.markedLayer = markedLayer;
        this.add(this.markedLayer);
    }

    #createHighlightedLayer(): void {
        const highlightedLayer = this.#createOutlinedRect(0, 0, this.width, this.height, 0xff00ff, 6);
        highlightedLayer.setVisible(false);
        this.highlightedLayer = highlightedLayer;
        this.add(this.highlightedLayer);
    }
}