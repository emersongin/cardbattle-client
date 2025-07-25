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
    align?: AlignType;
    color?: string;
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
    #titleWindow: TextWindow;
    #textWindow: TextWindow;
    #commandWindow: CommandWindow;
    
    constructor(readonly scene: CardBattleScene) {
        this.cardBattle = scene.getCardBattle();
    }

    getTitleWindow(): TextWindow {
        return this.#titleWindow;
    }

    createTitleWindow(title: string, config: TextWindowConfig): void {
        this.#titleWindow = TextWindow.createCentered(this.scene, title, {
            align: config.align || 'center',
            color: config.color || '#ffffff',
            relativeParent: config.relativeParent,
            onStartClose: config.onStartClose,
            onClose: config.onClose
        });
    }

    onCloseTitleWindow(onClose: () => void): void {
        if (this.#titleWindow) this.#titleWindow.setOnClose(onClose);
    }

    openTitleWindow(): void {
        if (this.#titleWindow) this.#titleWindow.open();
    }

    closeTitleWindow(): void {
        if (this.#titleWindow) this.#titleWindow.close();
    }

    destroyTitleWindow(): void {
        if (this.#textWindow) this.#textWindow.destroy();
    }

    createTextWindow(text: string, config: TextWindowConfig): void {
        this.#textWindow = TextWindow.createCentered(this.scene, text, {
            align: config.align || 'left',
            color: config.color || '#ffffff',
            relativeParent: config.relativeParent,
            onStartClose: config.onStartClose,
            onClose: config.onClose
        });
    }

    openTextWindow(): void {
        if (this.#textWindow) this.#textWindow.open();
    }

    closeTextWindow(): void {
        if (this.#textWindow) this.#textWindow.close();
    }

    destroyTextWindow(): void {
        if (this.#textWindow) this.#textWindow.destroy();
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