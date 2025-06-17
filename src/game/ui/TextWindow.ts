import { TextBox } from 'phaser3-rex-plugins/templates/ui/ui-components';

type TextWindowConfig = {
    onClose?: () => void
};

export class TextWindow extends TextBox {
    // #isOpen: boolean = false;
    #tween: Phaser.Tweens.Tween | null = null;
    #onCloseCallback?: () => void;

    private constructor(
        readonly scene: Phaser.Scene, 
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
        this.#onCloseCallback = callback;
        scene.add.existing(this);
    }

    static createCenteredWindow(scene: Phaser.Scene, text: string, config: TextWindowConfig) {
        const x = scene.cameras.main.centerX;
        const y = scene.cameras.main.centerY;
        const width = (scene.cameras.main.width / 12) * 11;
        const height = (scene.cameras.main.height / 12);
        return new TextWindow(scene,  x, y, width, height, text, config.onClose);
    }

    open() {
        if (!this.scene?.tweens) return;
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.addActionOnKeyDown();
            }
        });
    }

    private addActionOnKeyDown() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        const onKeyDown = () => {
            if (!keyboard) {
                throw new Error('Keyboard input is not available in this scene.');
            }
            keyboard.removeAllListeners();
            this.close();
        };
        keyboard.once('keydown-ENTER', onKeyDown, this);
    }

    close() {
        if (!this.scene?.tweens) return;
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (this.#onCloseCallback) this.#onCloseCallback();
            }
        });
    }

    isBusy() {
        return this.#tween !== null && this.#tween.isPlaying();
    }
}
