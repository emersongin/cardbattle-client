export class Card extends Phaser.GameObjects.Container {
    #backgroundLayer: Phaser.GameObjects.Container;
    #background: Phaser.GameObjects.Rectangle;
    #frontLayer: Phaser.GameObjects.Container;
    #picture: Phaser.GameObjects.Image;

    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number, 
        bgColor: number,
        cardType: string = 'power'
    ) {
        super(scene, x, y);
        this.width = 100;
        this.height = 150;
        this.createLayers();
        this.createBackground(bgColor);
        this.createPicture();
        this.createDisplay(cardType);
        this.scene.add.existing(this);
    }

    private createLayers(): void {
        this.createBackgroundLayer();
        this.createFrontLayer();
    }

    private createBackgroundLayer(): void {
        const backgroundLayer = this.scene.add.container(0, 0);
        this.#backgroundLayer = backgroundLayer;
        this.add(backgroundLayer);
    }

    private createFrontLayer(): void {
        const frontLayer = this.scene.add.container(0, 0);
        this.#frontLayer = frontLayer;
        this.add(frontLayer);
    }

    private createBackground(backgroundColor: number): void {
        const backgroundRect = this.scene.add.rectangle(0, 0, this.width, this.height, backgroundColor);
        backgroundRect.setOrigin(0, 0);
        this.#background = backgroundRect;
        this.#backgroundLayer.add(backgroundRect);
    }

    private createPicture(): void {
        const picture = this.scene.add.image(0, 0, 'card-picture');
        picture.setOrigin(0, 0);

        const larguraDesejada = 100 - 12;
        const alturaDesejada = 150 - 12;
        const escalaX = larguraDesejada / picture.width;
        const escalaY = alturaDesejada / picture.height;
        const escalaProporcional = Math.min(escalaX, escalaY);
        picture.setScale(escalaProporcional);

        picture.setPosition((this.width - picture.displayWidth) / 2, (this.height - picture.displayHeight) / 2);

        this.#picture = picture;
        this.#frontLayer.add(picture);
    }

    private createDisplay(cardType: string): void {
        let label: Phaser.GameObjects.Text;
        if (cardType === 'battle') {
            label = this.scene.add.text(this.width - 80, this.height - 32, '99/99', {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
            });
        } else if (cardType === 'power') {
            label = this.scene.add.text(this.width - 28, this.height - 32, 'P', {
                fontSize: '24px',
                color: '#ffffff',
                fontStyle: 'bold',
            });
        } else {
            throw new Error(`Unknown card type: ${cardType}`);
        }
        label.setOrigin(0, 0);
        this.#frontLayer.add(label);
    }

    static create(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        background: number
    ): Card {
        return new Card(scene, x, y, background);
    }
}