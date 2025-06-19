export class CardUi extends Phaser.GameObjects.Container {
    #background: Phaser.GameObjects.GameObject;

    private constructor(
        readonly scene: Phaser.Scene, 
        x: number, 
        y: number, 
        background: number
    ) {
        super(scene, x, y);
        this.#background = scene.add.rectangle(0, 0, 50, 75, background);
        this.width = 50;
        this.height = 75;
        this.add(this.#background);
        this.scene.add.existing(this);
    }

    static create(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        background: number
    ): CardUi {
        return new CardUi(scene, x, y, background);
    }
}