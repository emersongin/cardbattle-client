import { VueScene } from "@/game/scenes/VueScene";
import { TextWindow } from "./TextWindow";
import { TextWindowConfig } from "./TextWindowConfig";
import { TweenConfig } from "@/game/types/TweenConfig";

export class TextWindows {
    #textWindows: TextWindow[] = [];

    constructor(readonly scene: VueScene) {}

    #empty(): void {
        this.#textWindows = [];
    }

    createTextWindowTop(text: string, config: Partial<TextWindowConfig>): void {
        this.#empty();
        const windowConfig = {
            textAlign: config.textAlign || 'left',
            textColor: config.textColor || '#ffffff',
            relativeParent: config.relativeParent,
            onStartClose: () => this.#onStartCloseAllChildrenWindows(),
            onClose: config.onClose
        };
        this.#textWindows[0] = TextWindow.createTop(this.scene, { ...windowConfig, text });
    }

    #onStartCloseAllChildrenWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (index > 0) window.close({ onComplete: () => window.destroy()})
            });
        }
    }

    createTextWindowCentered(text: string, config: Partial<TextWindowConfig>): void {
        this.#empty();
        this.#textWindows[0] = this.#createTextWindowCentered(text, config);
    }

    #createTextWindowCentered(text: string, config: Partial<TextWindowConfig>): TextWindow {
        const windowConfig = {
            textAlign: config.textAlign || 'left',
            textColor: config.textColor || '#ffffff',
            relativeParent: config.relativeParent,
            marginTop: config.marginTop || 0,
            onStartClose: () => this.#onStartCloseAllChildrenWindows(),
            onClose: config.onClose
        };
        return TextWindow.createCentered(this.scene, { ...windowConfig, text });
    }

    addTextWindow(text: string, config?: Partial<TextWindowConfig>): void {
        if (!this.#textWindows.length) {
            throw new Error('You should create a text window first.');
        }
        if (!config) config = {};
        config.relativeParent = this.#getLastTextWindow();
        config.onStartClose = () => {}; // null
        this.#textWindows.push(this.#createTextWindowCentered(text, config));
    }

    #getLastTextWindow(): TextWindow {
        return this.#textWindows[this.#textWindows.length - 1];
    }

    setTextWindowText(newText: string, textWindowIndex: number): void {
        if (!this.#textWindows.length) {
            throw new Error('You should create a text window first.');
        }
        if (textWindowIndex < 0 || textWindowIndex >= this.#textWindows.length) {
            throw new Error(`TextWindow: index ${textWindowIndex} is out of bounds.`);
        }
        this.#textWindows[textWindowIndex].setText(newText);
    }

    openAllWindows(config?: TweenConfig): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (!index) return window.open(config);
                window.open();
            });
        }
    }

    closeAllWindows(config?: TweenConfig): void {
        this.#textWindows.forEach((window, index) => {
            if (!index && window.isOpen()) {
                return window.close({ 
                    ...config, 
                    onComplete: () => {
                        if (config?.onComplete) config.onComplete();
                    }
                });
            } else {
                if (config?.onComplete) config.onComplete();
            }
            window.close();
        });
    }
}