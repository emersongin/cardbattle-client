import { CardBattleScene } from '../CardBattleScene';
import { CardBattle } from "@game/api/CardBattle";
import { TextWindow } from '@game/ui/TextWindow';
import { LEFT, CENTER, RIGHT } from '@/game/constants/Keys';
import { CommandWindow } from '@/game/ui/CommandWindow';

export type AlignType = 
    | typeof LEFT 
    | typeof CENTER 
    | typeof RIGHT;

export type TextWindowConfig = {
    textAlign?: AlignType;
    textColor?: string;
    relativeParent?: TextWindow;
    onStartClose?: () => void;
    onClose?: () => void;
}

export type CommandOption = {
    description: string;
    onSelect: () => Promise<void>;
}

export class CardBattlePhase {
    protected cardBattle: CardBattle;
    #textWindows: TextWindow[] = [];
    #commandWindow: CommandWindow;
    
    constructor(readonly scene: CardBattleScene) {
        this.cardBattle = scene.getCardBattle();
    }

    createTextWindowCentered(title: string, config: TextWindowConfig): void {
        this.destroyAllTextWindows();
        this.#textWindows[0] = this.#createTextWindowCentered(title, config);
    }

    #createTextWindowCentered(title: string, config: TextWindowConfig): TextWindow {
        const windowConfig = {
            align: config.textAlign || 'left',
            color: config.textColor || '#ffffff',
            relativeParent: config.relativeParent,
            onStartClose: () => {
                this.#closeAllChildWindows();
            },
            onClose: config.onClose
        };
        return TextWindow.createCentered(this.scene, title, windowConfig);
    }

    #closeAllChildWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (index > 0) window.close(() => window.destroy())
            });
        }
    }

    addTextWindow(title: string, config?: TextWindowConfig): void {
        if (!this.#textWindows.length) {
            throw new Error('You should create a text window first.');
        }
        if (!config) config = {};
        config.relativeParent = this.getLastTextWindow();
        config.onStartClose = () => {}; // null
        this.#textWindows.push(this.#createTextWindowCentered(title, config));
    }

    getLastTextWindow(): TextWindow {
        return this.#textWindows[this.#textWindows.length - 1];
    }

    openAllWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach(window => window.open());
        }
    }

    closeAllWindows(onClose?: () => void): void {
        if (this.#textWindows[0]) this.#textWindows[0].close(onClose);
    }

    destroyAllTextWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach(window => window.destroy());
            this.#textWindows = [];
        }
    }

    createCommandWindow(title: string, options: CommandOption[]): void {
        this.#commandWindow = CommandWindow.createCentered(this.scene, title, options);
    }

    openCommandWindow(): void {
        this.#commandWindow.open();
    }

    destroyCommandWindow(): void {
        if (this.#commandWindow) this.#commandWindow.destroy();
    }
}