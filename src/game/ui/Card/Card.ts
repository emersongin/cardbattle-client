import { CardData } from "../Cardset/CardData";
import { CardState, StaticState, MovingState, UpdatingState } from "./CardState";

const CARD_WIDTH = 100;
const CARD_HEIGHT = 150;

export class Card extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Rectangle;
    image: Phaser.GameObjects.Image;
    display: Phaser.GameObjects.Text;
    status: CardState;
    faceUp: boolean = false;
    closed: boolean = false;
    disabled: boolean = false;
    cardData: CardData;

    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number, 
        cardData: CardData,
    ) {
        super(scene, x, y);
        this.cardData = cardData;
        this.width = CARD_WIDTH;
        this.height = CARD_HEIGHT;
        this.createLayers();
        this.setPoints();
        this.changeState(new StaticState(this));
        this.scene.add.existing(this);
    }

    static create(scene: Phaser.Scene, cardData: CardData): Card {
        return new Card(scene, 0, 0, cardData);
    }

    private createLayers(): void {
        this.createBackground();
        this.createImage();
        this.createDisplay();
    }

    private createBackground(): void {
        const backgroundColor = this.getBackgroundColor();
        const backgroundRect = this.scene.add.rectangle(0, 0, this.width, this.height, backgroundColor);
        backgroundRect.setOrigin(0, 0);
        this.background = backgroundRect;
        this.add(backgroundRect);
    }

    private getBackgroundColor(): number {
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

    private createImage(): void {
        const image = this.scene.add.image(0, 0, 'empty');
        this.image = image;
        this.setImage();
        this.add(this.image);
    }

    private setImage() {
        if (this.faceUp) {
            this.image.setTexture(this.cardData.imageName);
        } else {
            this.image.setTexture('card-back');
        }
        this.adjustImagePosition();
    }

    private adjustImagePosition(): void {
        const larguraDesejada = CARD_WIDTH - 12;
        const alturaDesejada = CARD_HEIGHT - 12;
        const escalaX = larguraDesejada / this.image.width;
        const escalaY = alturaDesejada / this.image.height;
        const escalaProporcional = Math.min(escalaX, escalaY);
        this.image.setOrigin(0, 0);
        this.image.setScale(escalaProporcional);
        this.image.setPosition((this.width - this.image.displayWidth) / 2, (this.height - this.image.displayHeight) / 2);
    }

    private createDisplay(): void {
        const display = this.scene.add.text(this.width - 80, this.height - 32, '', {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
        });
        this.display = display;
        this.display.setOrigin(0, 0);
        this.setDisplay();
        this.add(display);
    }

    private setDisplay() {
        if (!this.display || !this.faceUp) {
            this.setEmptyDisplay();
            return
        } 
        const { typeId: cardTypeId } = this.cardData;
        if (cardTypeId === 'battle') {
            this.setPointsDisplay();
        } else if (cardTypeId === 'power') {
            this.setPowerDisplay();
        } else {
            throw new Error(`Unknown card type id: ${cardTypeId}`);
        }
    }

    private setEmptyDisplay() {
        this.display.setText('');
    }

    private setPointsDisplay() {
        const { ap, hp } = this.getAllData('ap', 'hp');
        const apText = ap.toString().padStart(2, "0"); 
        const hpText = hp.toString().padStart(2, "0");
        this.display.setText(`${apText}/${hpText}`);
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
        this.display.setText('P');
    }

    private setPoints(): void {
        this.setData('hp', this.cardData.hp);
        this.setData('ap', this.cardData.ap);
    }

    changeState(state: CardState, ...args: any[]): void {
        this.status = state;
        this.status.create(...args);
    }

    preUpdate() {
        if (!this.status) return;
        this.status.update();
    }

    // Move methods
    movePosition(xTo: number, yTo: number): void {
        this.changeState(new MovingState(this));
        if (!(this.status instanceof MovingState)) return;
        this.status.movePosition(xTo, yTo);
    }

    moveFromTo(xFrom: number, yFrom: number, xTo: number, yTo: number, duration: number): void {
        this.changeState(new MovingState(this));
        if (!(this.status instanceof MovingState)) return;
        this.status.moveFromTo(xFrom, yFrom, xTo, yTo, duration);
    }

    // Open and close methods
    flip(): void {
        const onCanStartClose = () => {
            return !this.faceUp;
        };
        const onClosed = () => {
            this.faceUp = true;
            this.setImage();
            this.setDisplay();
        };
        this.close(onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return this.faceUp;
        };
        this.open(onCanStartOpen);
    }

    turnDown(): void {
        const onCanStartClose = () => {
            return this.faceUp;
        };
        const onClosed = () => {
            this.faceUp = false;
            this.setImage();
            this.setDisplay();
        };
        this.close(onCanStartClose, onClosed);
        const onCanStartOpen = () => {
            return !this.faceUp;
        };
        this.open(onCanStartOpen);
    }

    private close(onCanStart?: () => boolean, onClosed?: () => void): void {
        this.changeState(new MovingState(this));
        if (!(this.status instanceof MovingState)) return;
        this.status.close(onCanStart, onClosed);
    }

    isOpened(): boolean {
        return !this.closed;
    }

    private open(onCanStart?: () => boolean, onOpened?: () => void): void {
        this.changeState(new MovingState(this));
        if (!(this.status instanceof MovingState)) return;
        this.status.open(onCanStart, onOpened);
    }

    // Update points methods
    changeDisplayPoints(ap: number, hp: number): void {
        if (!this.status || !this.faceUp) return;
        if (this.status instanceof UpdatingState) {
            this.status.addTweens(ap, hp, 2000);
            return;
        }
        this.changeState(new UpdatingState(this), ap, hp, 1000);
    }

}