import { VueScene } from "@game/scenes/VueScene";
import { TextWindow } from "@ui/TextWindows/TextWindow";
import { TextWindowConfig } from "@ui/TextWindows/TextWindowConfig";
import { TweenConfig } from "@game/types/TweenConfig";

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
        };
        this.#textWindows[0] = TextWindow.createTop(this.scene, { ...windowConfig, text });
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
            // onStartClose: () => this.#onStartCloseAllChildrenWindows(),
            // onClose: config.onClose
        };
        return TextWindow.createCentered(this.scene, { ...windowConfig, text });
    }

    addTextWindow(text: string, config?: Partial<TextWindowConfig>): void {
        if (!this.#textWindows.length) {
            throw new Error('You should create a text window first.');
        }
        if (!config) config = {};
        config.relativeParent = this.#getLastTextWindow();
        const textFormatted = this.#breakTextWithoutCuttingWords(text, 60);
        this.#textWindows.push(this.#createTextWindowCentered(textFormatted, config));
    }

    #breakTextWithoutCuttingWords(
        text: string,
        maxLength: number
    ): string {
        const words = text.split(" ");
        let line = "";
        const resultLines: string[] = [];
        for (const word of words) {
            if ((line + (line ? " " : "") + word).length <= maxLength) {
            line += (line ? " " : "") + word;
            } else {
            resultLines.push(line);
            line = word;
            }
        }
        if (line) {
            resultLines.push(line);
        }
        return resultLines.join("\n");
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
        if (!this.#textWindows.length) {
            if (config?.onComplete) config.onComplete();
            return;
        }
        this.#textWindows.forEach((window: TextWindow, index: number) => {
            if (!index && window.isClosed()) return window.open(config);
            window.open();
        });
    }

    closeAllWindows(config?: TweenConfig): void {
        if (!this.#textWindows.length) {
            if (config?.onComplete) config.onComplete();
            return;
        }
        this.#textWindows.forEach((window, index) => {
            if (!index && window.isOpened()) return window.close({ ...config, 
                onComplete: () => {
                    if (config?.onComplete) config.onComplete();
                    this.#empty();
                } 
            });
            window.close();
        });
    }
}