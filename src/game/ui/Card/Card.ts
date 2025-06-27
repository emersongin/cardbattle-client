import { CardData } from "../Cardset/CardData";
import { CardState, StaticState, MovingState } from "./CardState";
import { Move } from "./Move";

export class Card extends Phaser.GameObjects.Container {
    background: Phaser.GameObjects.Rectangle;
    image: Phaser.GameObjects.Image;
    display: Phaser.GameObjects.Text;
    status: CardState;
    faceUp: boolean = true;
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
        this.width = 100;
        this.height = 150;
        this.cardData = cardData;
        this.createBackground();
        this.createImage();
        this.createDisplay();
        this.changeState(new StaticState(this));
        this.scene.add.existing(this);
    }

    private createBackground(): void {
        const backgroundColor = this.getBgColor();
        const backgroundRect = this.scene.add.rectangle(0, 0, this.width, this.height, backgroundColor);
        backgroundRect.setOrigin(0, 0);
        this.background = backgroundRect;
        this.add(backgroundRect);
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

    private createImage(): void {
        const image = this.scene.add.image(0, 0, this.cardData.imageName);
        image.setOrigin(0, 0);

        const larguraDesejada = 100 - 12;
        const alturaDesejada = 150 - 12;
        const escalaX = larguraDesejada / image.width;
        const escalaY = alturaDesejada / image.height;
        const escalaProporcional = Math.min(escalaX, escalaY);
        image.setScale(escalaProporcional);

        image.setPosition((this.width - image.displayWidth) / 2, (this.height - image.displayHeight) / 2);

        this.image = image;
        this.add(image);
    }

    private createDisplay(): void {
        let display: Phaser.GameObjects.Text;
        const cardTypeId = this.cardData.typeId;
        if (cardTypeId === 'battle') {
            const { ap, hp } = this.cardData;
            const apText = ap.toString().padStart(2, "0"); 
            const hpText = hp.toString().padStart(2, "0");
            display = this.scene.add.text(this.width - 80, this.height - 32, `${apText}/${hpText}`, {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
            });
        } else if (cardTypeId === 'power') {
            display = this.scene.add.text(this.width - 28, this.height - 32, 'P', {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
            });
        } else {
            throw new Error(`Unknown card type id: ${cardTypeId}`);
        }
        display.setOrigin(0, 0);
        this.display = display;
        this.add(display);
    }

    static create(
        scene: Phaser.Scene, 
        cardData: CardData
    ): Card {
        return new Card(scene, 0, 0, cardData);
    }

    changeState(state: CardState) {
        this.status = state;
        this.status.create();
    }

    preUpdate() {
        if (!this.status) return;
        this.status.update();
    }

    movePosition(x: number, y: number): void {
        if (!this.status) return;
        const moves: Move[] = [{ x, y }];
        this.move(moves, 0);
    }

    private move(moves: Move[], duration: number): void {
        if (!this.status) return;        
        if (this.status instanceof MovingState) {
            this.status.addMoves(moves, duration);
            return;
        }
        this.changeState(new MovingState(this, moves, duration));
    }

    moveFromTo(xFrom: number, yFrom: number, xTo: number, yTo: number, duration: number): void {
        if (!this.status) return;
        const moves: Move[] = [
            { x: xFrom, y: yFrom, duration: 0 }, 
            { x: xTo, y: yTo, duration }
        ];
        this.move(moves, duration);
    }

    open(): void {
        if (this.closed) return;
        const moves: Move[] = [
            {
                x: this.x,
                scaleX: 1,
                ease: 'Linear',
                onComplete: () => {
                    this.closed = false;
                }, 
            }
        ];
        this.move(moves, 200);
    }

    close(): void {
        if (this.closed) return;
        const moves: Move[] = [
            {
                x: this.x + (this.width / 2),
                scaleX: 0,
                ease: 'Linear',
                onComplete: () => {
                    this.closed = true;
                }, 
            },
        ];
        this.move(moves, 200);
    }

    flip(): void {
        if (this.closed) return;
        this.close();
        this.open();
    }
}