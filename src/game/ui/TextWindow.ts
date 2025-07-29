import { TextBox } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { DisplayUtil } from '../utils/DisplayUtil';

export type TextWindowConfig = {
    text: string,
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    textColor?: string,
    textAlign?: 'center' | 'left' | 'right',
    onStartClose?: () => void,
    onClose?: () => void,
    relativeParent?: TextWindow,
    marginTop?: number
};

export class TextWindow extends TextBox {
    #tween: Phaser.Tweens.Tween | null = null;
    #onStartClose?: () => void;
    #onClose?: () => void;

    private constructor(
        readonly scene: Phaser.Scene, 
        config: TextWindowConfig
    ) {
        super(scene, {
            x: config.x,
            y: config.y,
            width: config.width,
            height: config.height,
            background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 4, 0x222222),
            text: scene.add.text(0, 0, config.text, {
                fontSize: '24px',
                align: config.textAlign || 'left',
                color: config.textColor || '#ffffff',
                wordWrap: { 
                    width: config.width - 20, 
                },
            }),
            expandTextWidth: true,
            space: {
                left: 10, right: 10, top: 10, bottom: 10
            }
        });
        this.layout();
        this.setScale(1, 0);
        this.setStartClose(config.onStartClose);
        this.#setOnClose(config.onClose);
        scene.add.existing(this);
    }

    setStartClose(onStartClose?: () => void): void {
        if (typeof onStartClose !== 'function') return;
        this.#onStartClose = onStartClose;
    }

    #setOnClose(onClose?: () => void): void {
        if (onClose) this.#onClose = onClose;
    }

    static createTop(scene: Phaser.Scene, config: Partial<TextWindowConfig>) {
        const { relativeParent } = config;
        const x = scene.cameras.main.centerX;
        let y = DisplayUtil.column1of12(scene.scale.height);
        if (relativeParent) {
            y = relativeParent.y - relativeParent.height - 2 + (config.marginTop || 0);
        }
        const width = (scene.cameras.main.width / 12) * 11;
        const height = (scene.cameras.main.height / 12);
        const text = config.text || '';
        return new TextWindow(scene, { ...config, text, x, y, width, height });
    }

    static createCentered(scene: Phaser.Scene, config: Partial<TextWindowConfig>) {
        const { relativeParent } = config;
        const x = scene.cameras.main.centerX;
        let y = scene.cameras.main.centerY;
        if (relativeParent) {
            y = relativeParent.y + relativeParent.height + 2 + (config.marginTop || 0);
        }
        const width = (scene.cameras.main.width / 12) * 11;
        const height = (scene.cameras.main.height / 12);
        const text = config.text || '';
        return new TextWindow(scene, { ...config, text, x, y, width, height });
    }

    open() {
        if (!this.scene?.tweens) return;
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (this.#onClose) this.#addOnCompletedListener();
            }
        });
    }

    close(onClose?: () => void) {
        if (!this.scene?.tweens) return;
        if (onClose) this.#setOnClose(onClose);
        this.#tween = this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (this.#onClose) this.#onClose();
                this.destroy();
            }
        });
    }

    isBusy() {
        return this.#tween !== null && this.#tween.isPlaying();
    }

    #addOnCompletedListener() {
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
            if (this.#onStartClose) this.#onStartClose();
        };
        keyboard.once('keydown-ENTER', onKeyDown, this);
    }
}
