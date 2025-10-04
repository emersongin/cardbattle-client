import Phaser from "phaser";
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from "@constants/colors";
import { CARD_HEIGHT, CARD_WIDTH } from "@constants/default";
import { Card } from "@ui/Card/Card";
import { VueScene } from "@game/scenes/VueScene";

export class CardUi extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Rectangle;
    image: Phaser.GameObjects.Image;
    display: Phaser.GameObjects.Text;
    disabledLayer: Phaser.GameObjects.Rectangle;
    selectedLayer: Phaser.GameObjects.Container;

    constructor(readonly scene: VueScene, readonly card: Card) {
        super(scene);
        this.setSize(CARD_WIDTH, CARD_HEIGHT);
        this.#createLayers();
    }

    #createLayers(): void {
        this.#createBackground();
        this.#createImage();
        this.#createDisplay();
        this.#createDisabledLayer();
        this.#createSelectedLayer();
    }

    #createBackground(): void {
        const backgroundColor = this.getBackgroundColor();
        const backgroundRect = this.getScene().add.rectangle(0, 0, this.width, this.height, backgroundColor);
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
        const image = this.getScene().add.image(0, 0, 'empty');
        this.image = image;
        this.#adjustImagePosition();
        this.add(this.image);
    }

    getScene(): VueScene {
        return this.scene || this.card.scene as VueScene;
    }

    setImage(imageName: string): void {
        this.image.setTexture(imageName);
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
        const display = this.getScene().add.text(this.width - 80, this.height - 32, '', {
            fontSize: '24px',
            color: (this.card.staticData.color === WHITE) ? '#000' : '#fff',
            fontStyle: 'bold',
        });
        this.display = display;
        this.add(this.display);
    }

    setDisplayText(text: string): void {
        if (!this.display) return;
        this.display.setText(text);
    }

    #createDisabledLayer(): void {
        const disabledLayer = this.getScene().add.rectangle(0, 0, this.width, this.height, 0x000000, 0.6);
        disabledLayer.setOrigin(0, 0);
        disabledLayer.setVisible(this.card.isDisabled() || false);
        this.disabledLayer = disabledLayer;
        this.add(this.disabledLayer);
    }

    #createSelectedLayer(): void {
        const selectedLayer = this.getScene().add.container(0, 0);
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
        const g = this.getScene().add.graphics();
        g.lineStyle(thickness, color);
        g.strokeRect(x, y, w, h);
        return g;
    }
}