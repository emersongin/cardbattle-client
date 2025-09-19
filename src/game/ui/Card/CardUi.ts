import Phaser from "phaser";
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from "@constants/colors";
import { CARD_HEIGHT, CARD_WIDTH } from "@constants/default";
import { BATTLE, POWER } from "@constants/keys";
import { CardType } from "@game/types/CardType";
import { Card } from "@ui/Card/Card";

export class CardUi extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Rectangle;
    image: Phaser.GameObjects.Image;
    display: Phaser.GameObjects.Text;
    disabledLayer: Phaser.GameObjects.Rectangle;
    selectedLayer: Phaser.GameObjects.Container;

    constructor(
        readonly scene: Phaser.Scene,
        readonly card: Card
    ) {
        super(scene);
        this.setSize(CARD_WIDTH, CARD_HEIGHT);
        this.#createLayers();
    }

    #createLayers(): void {
        this.#createBackground();
        this.#createImage();
        this.#createDisplay();
        this.#createDisabledLayer();
        this.#createSelectedLayer(); // Default color for selected layer
    }

    #createBackground(): void {
        const backgroundColor = this.getBackgroundColor();
        const backgroundRect = this.scene.add.rectangle(0, 0, this.width, this.height, backgroundColor);
        backgroundRect.setOrigin(0, 0);
        this.background = backgroundRect;
        this.add(this.background);
    }

    getBackgroundColor(): number {
        switch (this.card.staticData.color) {
            case RED:
                return 0xff0000; // Red
            case BLUE:
                return 0x0000ff; // Blue
            case GREEN:
                return 0x00ff00; // Green
            case WHITE:
                return 0xffffff; // White
            case BLACK:
                return 0x000000; // Black
            case ORANGE:
                return 0xffa500; // Orange
            default:
                throw new Error(`Unknown color: ${this.card.staticData.color}`);
        }
    }

    #createImage(): void {
        const image = this.scene.add.image(0, 0, 'empty');
        this.image = image;
        this.setImage();
        this.add(this.image);
    }

    setImage(): void {
        const faceUp = this.card.data.get('faceUp');
        if (faceUp) {
            this.image.setTexture(this.card.staticData.imageName);
        } else {
            this.image.setTexture('cardback');
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
            color: (this.card.staticData.color === WHITE) ? '#000' : '#fff',
            fontStyle: 'bold',
        });
        this.display = display;
        this.setDisplay(this.card.staticData.ap, this.card.staticData.hp);
        this.add(this.display);
    }

    setDisplay(ap?: number, hp?: number): void {
        const faceUp = this.card.data.get('faceUp');
        if (!this.display || !faceUp) {
            this.#setEmptyDisplay();
            return
        } 
        const { typeId: cardTypeId } = this.card.staticData;
        if (cardTypeId === BATTLE as CardType) {
            this.setPointsDisplay(ap, hp);
        } else if (cardTypeId === POWER as CardType) {
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
        disabledLayer.setVisible(this.card.staticData.disabled || false);
        this.disabledLayer = disabledLayer;
        this.add(this.disabledLayer);
    }

    #createSelectedLayer(): void {
        const selectedLayer = this.scene.add.container(0, 0);
        selectedLayer.setVisible(false);
        this.selectedLayer = selectedLayer;
        this.add(this.selectedLayer);
    }

    setSelectedLayerVisible(visible: boolean): void {
        if (!this.selectedLayer) {
            throw new Error('Selected layer is not initialized.');
        }
        this.selectedLayer.setVisible(visible || false);
    }

    changeSelectedLayerColor(color: number): void {
        if (!this.selectedLayer) {
            throw new Error('Selected layer is not initialized.');
        }
        this.selectedLayer.removeAll(true);
        this.selectedLayer.add(this.#createOutlinedRect(0, 0, this.width, this.height, 0x000000, 6));
        this.selectedLayer.add(this.#createOutlinedRect(0, 0, this.width, this.height, color || 0xffff00, 6));
    }

    #createOutlinedRect(x: number, y: number, w: number, h: number, color = 0xffffff, thickness = 2) {
        const g = this.scene.add.graphics();
        g.lineStyle(thickness, color);
        g.strokeRect(x, y, w, h);
        return g;
    }
}