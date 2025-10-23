import { TextBox } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { TweenConfig } from '@game/types/TweenConfig';
import { DisplayUtil } from '@utils/DisplayUtil';
import { TextWindowConfig } from '@ui/TextWindows/TextWindowConfig';
import { VueScene } from '@game/scenes/VueScene';

export class TextWindow {
    #textBox: TextBox;

    private constructor(
        readonly scene: VueScene, 
        config: TextWindowConfig
    ) {
        this.#textBox = new TextBox(scene, {
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
        this.#textBox.layout();
        this.#textBox.setScale(1, 0);
        this.#setYPositionByHeight(config.height);
        scene.add.existing(this.#textBox);
    }

    #setYPositionByHeight(height: number): void {
        this.#textBox.y = this.#textBox.y + ((this.#textBox.height - (height ?? 0)) / 2);
    }

    static createTop(scene: VueScene, config: Partial<TextWindowConfig>) {
        const { relativeParent } = config;
        const x = scene.cameras.main.centerX;
        let y = DisplayUtil.column1of12(scene.scale.height);
        if (relativeParent) {
            y = relativeParent.getY() - relativeParent.getHeight() - 2 + (config.marginTop || 0);
        }
        const width = (scene.cameras.main.width / 12) * 11;
        const height = (scene.cameras.main.height / 12);
        const text = config.text || '';
        return new TextWindow(scene, { ...config, text, x, y, width, height });
    }

    static createCentered(scene: VueScene, config: Partial<TextWindowConfig>) {
        const { relativeParent } = config;
        const x = scene.cameras.main.centerX;
        let y = scene.cameras.main.centerY;
        if (relativeParent) {
            y = (relativeParent.getY() + relativeParent.getHeight()) + 2 + (config.marginTop || 0);
        }
        const width = (scene.cameras.main.width / 12) * 11;
        const height = (scene.cameras.main.height / 12);
        const text = config.text || '';
        return new TextWindow(scene, { ...config, text, x, y, width, height });
    }

    open(config?: TweenConfig) {
        if (!this.scene?.tweens) return;
        this.scene.tweens.add({
            targets: this.#textBox,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onStart: () => {
                if (config?.onStart) config.onStart();
            },
            onComplete: async () => {
                this.#textBox.scaleY = 1;
                if (config?.onComplete) config.onComplete();
            }
        });
    }

    close(config?: TweenConfig) {
        if (!this.scene?.tweens) return;
        this.scene.tweens.add({
            targets: this.#textBox,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeOut',
            onStart: () => {
                if (config?.onStart) config.onStart();
            },
            onComplete: () => {
                this.#textBox.scaleY = 0;
                if (config?.onComplete) config.onComplete();
                this.#textBox.destroy();
            }
        });
    }

    isOpened(): boolean {
        return this.getScaleY() === 1;
    }

    isClosed(): boolean {
        return this.getScaleY() === 0;
    }

    setText(text: string): void {
        this.#textBox.setText(text);
    }

    getY(): number {
        return this.#textBox.y;
    }

    getHeight(): number {
        return this.#textBox.height;
    }

    getScaleY(): number {
        return this.#textBox.scaleY;
    }
}
