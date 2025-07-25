import { CardBattleScene } from '../CardBattleScene';
import { CardBattle } from "@game/api/CardBattle";
import { TextWindow } from '@game/ui/TextWindow';
import { LEFT, CENTER, RIGHT } from '@/game/constants/Keys';

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

export class CardBattlePhase {
    protected cardBattle: CardBattle;
    #titleWindow: TextWindow;
    #textWindow: TextWindow;
    
    constructor(readonly scene: CardBattleScene) {
        this.cardBattle = scene.getCardBattle();
    }

    getTitleWindow(): TextWindow {
        return this.#titleWindow;
    }

    createTitleWindow(title: string, config: TextWindowConfig): void {
        this.#titleWindow = TextWindow.createCentered(this.scene, title, {
            align: config.align || 'center',
            color: config.color || '#ff3c3c',
            relativeParent: config.relativeParent,
            onStartClose: config.onStartClose,
            onClose: config.onClose
        });
    }

    openTitleWindow(): void {
        this.#titleWindow.open();
    }

    closeTextWindow(): void {
        if (this.#textWindow) this.#textWindow.close();
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
        this.#textWindow.open();
    }

    destroyTextWindow(): void {
        if (this.#textWindow) this.#textWindow.destroy();
    }
}