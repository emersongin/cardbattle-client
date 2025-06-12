import { TextBox } from 'phaser3-rex-plugins/templates/ui/ui-components';

export class TextWindow extends TextBox {
    #tween: Phaser.Tweens.Tween | null = null;
    private constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        width: number, 
        height: number, 
        text: string,
        callback?: () => void
    ) {
        super(scene, {
            x,
            y,
            width,
            height,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 4, 0x222222),
            text: scene.add.text(0, 0, text, {
                fontSize: '24px',
                align: 'center',
                wordWrap: { 
                    width: width - 20, 
                }
            }),
            expandTextWidth: true,
            space: {
                left: 10, right: 10, top: 10, bottom: 10
            }
        });
        this.layout();
        this.setScale(1, 0);
        this.addAction(scene, callback);
        scene.add.existing(this);
    }

    addAction(scene: Phaser.Scene, callback?: () => void) {
        if (!scene.input.keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        scene.input.keyboard.on('keydown-SPACE', () => {
            if (this.isBusy()) return;
            if (callback && this.isOpen()) callback();
            this.isClose() ? this.open() : this.close();
        });
    }

    static createCenteredWindow(scene: Phaser.Scene, text: string, callback?: () => void) {
        const x = scene.cameras.main.centerX;
        const y = scene.cameras.main.centerY;
        const width = (scene.cameras.main.width / 12) * 11;
        const height = (scene.cameras.main.height / 12);
        return new TextWindow(scene,  x, y, width, height, text, callback);
    }

    isOpen() {
        return this.scaleY === 1;
    }

    isClose() {
        return this.scaleY === 0;
    }

    isAvailable() {
        return !this.isBusy();
    }

    isBusy() {
        return this.#tween !== null && this.#tween.isPlaying();
    }

    open() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }

    close() {
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeOut'
        });
    }
}
