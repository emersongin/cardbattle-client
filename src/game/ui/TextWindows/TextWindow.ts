import { TextBox } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { TweenConfig } from '@game/types/TweenConfig';
import { DisplayUtil } from '@utils/DisplayUtil';
import { TextWindowConfig } from '@ui/TextWindows/TextWindowConfig';
import { VueScene } from '@/game/scenes/VueScene';

export class TextWindow extends TextBox {
    #onStartClose?: () => void;
    #onClose?: () => void;

    private constructor(
        readonly scene: VueScene, 
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

    static createTop(scene: VueScene, config: Partial<TextWindowConfig>) {
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

    static createCentered(scene: VueScene, config: Partial<TextWindowConfig>) {
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

    open(config?: TweenConfig) {
        if (!this.scene?.tweens) return;
        this.scene.tweens.add({
            targets: this,
            scaleY: 1,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: async () => {
                if (config?.onComplete) {
                    await config.onComplete();
                    if (this.#onClose) this.#addOnCompletedListener();
                    return;
                }
                if (this.#onClose) this.#addOnCompletedListener();
            }
        });
    }

    close(config?: TweenConfig) {
        if (!this.scene?.tweens) return;
        this.scene.tweens.add({
            targets: this,
            scaleY: 0,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                if (config?.onComplete) config.onComplete();
                this.destroy();
            }
        });
    }

    isOpen(): boolean {
        return this.scaleY === 1;
    }

    #addOnCompletedListener() {
        this.scene.addKeyEnterListeningOnce({
            onTrigger: () => {
                if (this.#onStartClose) this.#onStartClose();
                this.close({ onComplete: this.#onClose });
            }
        });
    }
}
