import { CardBattleScene } from '../CardBattleScene';
import { CardBattle } from "@game/api/CardBattle";
import { TextWindow, TextWindowConfig } from '@game/ui/TextWindow';
import { LEFT, CENTER, RIGHT } from '@/game/constants/Keys';
import { CommandWindow } from '@/game/ui/CommandWindow';
import BoardWindow, { BoardZones } from '@/game/ui/BoardWindow/BoardWindow';
import { BoardWindowData, CardData } from '@/game/types';
import { CARD_HEIGHT, CARD_WIDTH, CardColors } from '@/game/ui/Card/Card';
import { Cardset } from '@/game/ui/Cardset/Cardset';

export type AlignType = 
    | typeof LEFT 
    | typeof CENTER 
    | typeof RIGHT;

export type CommandOption = {
    description: string;
    onSelect: () => Promise<void> | void;
}

export class CardBattlePhase {
    protected cardBattle: CardBattle;
    #textWindows: TextWindow[] = [];
    #commandWindow: CommandWindow;
    #playerBoard: BoardWindow;
    #opponentBoard: BoardWindow;
    #playerCardset: Cardset;
    #opponentCardset: Cardset;
    
    constructor(readonly scene: CardBattleScene) {
        this.cardBattle = scene.getCardBattle();
    }

    createTextWindowTop(text: string, config: Partial<TextWindowConfig>): void {
        this.destroyAllTextWindows();
        this.#textWindows[0] = this.#createTextWindowTop(text, config);
    }

    #createTextWindowTop(text: string, config: Partial<TextWindowConfig>): TextWindow {
        const windowConfig = {
            textAlign: config.textAlign || 'left',
            textColor: config.textColor || '#ffffff',
            relativeParent: config.relativeParent,
            onStartClose: () => {
                this.#closeAllChildWindows();
            },
            onClose: config.onClose
        };
        return TextWindow.createTop(this.scene, { ...windowConfig, text });
    }

    createTextWindowCentered(title: string, config: Partial<TextWindowConfig>): void {
        this.destroyAllTextWindows();
        this.#textWindows[0] = this.#createTextWindowCentered(title, config);
    }

    #createTextWindowCentered(text: string, config: Partial<TextWindowConfig>): TextWindow {
        const windowConfig = {
            textAlign: config.textAlign || 'left',
            textColor: config.textColor || '#ffffff',
            relativeParent: config.relativeParent,
            marginTop: config.marginTop || 0,
            onStartClose: () => {
                this.#closeAllChildWindows();
            },
            onClose: config.onClose
        };
        return TextWindow.createCentered(this.scene, { ...windowConfig, text });
    }

    #closeAllChildWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (index > 0) window.close(() => window.destroy())
            });
        }
    }

    addTextWindow(title: string, config?: Partial<TextWindowConfig>): void {
        if (!this.#textWindows.length) {
            throw new Error('You should create a text window first.');
        }
        if (!config) config = {};
        config.relativeParent = this.getLastTextWindow();
        config.onStartClose = () => {}; // null
        this.#textWindows.push(this.#createTextWindowCentered(title, config));
    }

    setTextWindowText(text: string, index: number): void {
        if (!this.#textWindows.length) {
            throw new Error('You should create a text window first.');
        }
        if (index < 0 || index >= this.#textWindows.length) {
            throw new Error(`TextWindow: index ${index} is out of bounds.`);
        }
        this.#textWindows[index].setText(text);
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

    createCommandWindowCentered(title: string, options: CommandOption[]): void {
        this.#commandWindow = CommandWindow.createCentered(this.scene, title, options);
    }

    createCommandWindowBottom(title: string, options: CommandOption[]): void {
        this.#commandWindow = CommandWindow.createBottom(this.scene, title, options);
    }

    openCommandWindow(): void {
        this.#commandWindow.open();
    }

    destroyCommandWindow(): void {
        if (this.#commandWindow) this.#commandWindow.destroy();
    }

    async createPlayerBoard(): Promise<void> {
        return new Promise(async (resolve) => {
            const playerBoardData: BoardWindowData = await this.cardBattle.getPlayerBoardData();
            const boardWindow = BoardWindow.createBottom(this.scene, playerBoardData, 0x3C64DE);
            this.#playerBoard = boardWindow;
            resolve();
        });
    }

    addPlayerBoardZonePoints(boardZone: BoardZones, value: number): void {
        this.#playerBoard.addZonePoints(boardZone, value);
    }

    removePlayerBoardZonePoints(boardZone: BoardZones, value: number): void {
        this.#playerBoard.removeZonePoints(boardZone, value);
    }

    addPlayerBoardColorPoints(cardColor: CardColors, value: number): void {
        this.#playerBoard.addColorPoints(cardColor, value);
    }

    openPlayerBoard(onComplete?: () => void): void {
        this.#playerBoard.open(onComplete);
    }

    closePlayerBoard(onComplete?: () => void): void {
        this.#playerBoard.close(onComplete);
    }

    destroyPlayerBoard(): void {
        if (this.#playerBoard) this.#playerBoard.destroy();
    }

    async createOpponentBoard(): Promise<void> {
        return new Promise(async (resolve) => {
            const opponentBoardData: BoardWindowData = await this.cardBattle.getOpponentBoardData();
            const boardWindow = BoardWindow.createTopReverse(this.scene, opponentBoardData, 0xDE3C5A);
            this.#opponentBoard = boardWindow;
            resolve();
        });
    }

    addOpponentBoardZonePoints(boardZone: BoardZones, value: number): void {
        this.#opponentBoard.addZonePoints(boardZone, value);
    }

    removeOpponentBoardZonePoints(boardZone: BoardZones, value: number): void {
        this.#opponentBoard.removeZonePoints(boardZone, value);
    }

    addOpponentBoardColorPoints(cardColor: CardColors, value: number): void {
        this.#opponentBoard.addColorPoints(cardColor, value);
    }

    openOpponentBoard(): void {
        this.#opponentBoard.open();
    }

    closeOpponentBoard(): void {
        this.#opponentBoard.close();
    }

    destroyOpponentBoard(): void {
        if (this.#opponentBoard) this.#opponentBoard.destroy();
    }

    createPlayerBattleCardset(playerCards: CardData[]): Cardset {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
        const y = (this.#playerBoard.y - (this.#playerBoard.height / 2)) - CARD_HEIGHT - 10; 
        const cardset = Cardset.create(this.scene, playerCards, x, y);
        this.#playerCardset = cardset;
        return cardset;
    }

    createPlayerHandCardset(playerCards: CardData[]): Cardset {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
        const y = this.scene.cameras.main.centerY; 
        const cardset = Cardset.create(this.scene, playerCards, x, y);
        this.#playerCardset = cardset;
        return cardset;
    }

    getPlayerBattleCardset(): Cardset {
        return this.#playerCardset;
    }

    destroyPlayerBattleCardset(): void {
        if (this.#playerCardset) this.#playerCardset.destroy();
    }

    createOpponentBattleCardset(opponentCards: CardData[]): Cardset {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3));
        const y = (this.#opponentBoard.y + (this.#opponentBoard.height / 2)) + 10;
        const cardset = Cardset.create(this.scene, opponentCards, x, y);
        this.#opponentCardset = cardset;
        return cardset;
    }

    getOpponentBattleCardset(): Cardset {
        return this.#opponentCardset;
    }

    destroyOpponentBattleCardset(): void {
        if (this.#opponentCardset) this.#opponentCardset.destroy();
    }
}