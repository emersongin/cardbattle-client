import { CardData } from "../Cardset/CardData";
import { CardState, StaticState, MovingState } from "./CardState";
import { Position } from "./Position";

export class Card extends Phaser.GameObjects.Container {
    backgroundLayer: Phaser.GameObjects.Container;
    background: Phaser.GameObjects.Rectangle;
    frontLayer: Phaser.GameObjects.Container;
    picture: Phaser.GameObjects.Image;
    cardData: CardData;
    cardState: CardState;
    disabled: boolean = false;

    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number, 
        cardData: CardData,
    ) {
        super(scene, x, y);
        this.width = 100;
        this.height = 150;
        this.cardData = cardData;
        this.createLayers();
        this.createBackground();
        this.createPicture();
        this.createDisplay();
        this.changeState(new StaticState(this));
        this.scene.add.existing(this);
    }

    private createLayers(): void {
        this.createBackgroundLayer();
        this.createFrontLayer();
    }

    private createBackgroundLayer(): void {
        const backgroundLayer = this.scene.add.container(0, 0);
        this.backgroundLayer = backgroundLayer;
        this.add(backgroundLayer);
    }

    private createFrontLayer(): void {
        const frontLayer = this.scene.add.container(0, 0);
        this.frontLayer = frontLayer;
        this.add(frontLayer);
    }

    private createBackground(): void {
        const backgroundColor = this.getBgColor();
        const backgroundRect = this.scene.add.rectangle(0, 0, this.width, this.height, backgroundColor);
        backgroundRect.setOrigin(0, 0);
        this.background = backgroundRect;
        this.backgroundLayer.add(backgroundRect);
    }

    private getBgColor(): number {
        switch (this.cardData.color) {
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
                throw new Error(`Unknown color: ${this.cardData.color}`);
        }
    }

    private createPicture(): void {
        const picture = this.scene.add.image(0, 0, this.cardData.pictureName);
        picture.setOrigin(0, 0);

        const larguraDesejada = 100 - 12;
        const alturaDesejada = 150 - 12;
        const escalaX = larguraDesejada / picture.width;
        const escalaY = alturaDesejada / picture.height;
        const escalaProporcional = Math.min(escalaX, escalaY);
        picture.setScale(escalaProporcional);

        picture.setPosition((this.width - picture.displayWidth) / 2, (this.height - picture.displayHeight) / 2);

        this.picture = picture;
        this.frontLayer.add(picture);
    }

    private createDisplay(): void {
        let label: Phaser.GameObjects.Text;
        const cardTypeId = this.cardData.typeId;
        if (cardTypeId === 'battle') {
            const { ap, hp } = this.cardData;
            const apText = ap.toString().padStart(2, "0"); 
            const hpText = hp.toString().padStart(2, "0");
            label = this.scene.add.text(this.width - 80, this.height - 32, `${apText}/${hpText}`, {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
            });
        } else if (cardTypeId === 'power') {
            label = this.scene.add.text(this.width - 28, this.height - 32, 'P', {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
            });
        } else {
            throw new Error(`Unknown card type id: ${cardTypeId}`);
        }
        label.setOrigin(0, 0);
        this.frontLayer.add(label);
    }

    static create(
        scene: Phaser.Scene, 
        cardData: CardData
    ): Card {
        return new Card(scene, 0, 0, cardData);
    }

    changeState(state: CardState) {
        this.cardState = state;
        this.cardState.create();
    }

    preUpdate() {
        if (!this.cardState) return;
        this.cardState.update();
    }

    move(moves: Position[]): void {
        if (!this.cardState) return;
        this.changeState(new MovingState(this, moves));
    }
}