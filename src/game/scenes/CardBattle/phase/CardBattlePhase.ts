import { CardBattleScene } from '../CardBattleScene';
import { CardBattle } from "@game/api/CardBattle";
import { TextWindow } from '@/game/ui/TextWindow/TextWindow';
import { LEFT, CENTER, RIGHT } from '@/game/constants/keys';
import { CommandWindow } from '@/game/ui/CommandWindow/CommandWindow';
import BoardWindow from '@/game/ui/BoardWindow/BoardWindow';
import { BoardWindowData, BoardZones, CardData } from '@/game/types';
import { Cardset } from '@/game/ui/Cardset/Cardset';
import { TimelineConfig, TimelineEvent } from '../../VueScene';
import { CardUi } from '@/game/ui/Card/CardUi';
import { CardColors } from '@/game/ui/Card/types/CardColors';
import { CARD_HEIGHT, CARD_WIDTH } from '@/game/constants/default';
import { CommandOption } from '@/game/ui/CommandWindow/CommandOption';
import { Card } from '@/game/ui/Card/Card';
import { CardActionsBuilder } from '@/game/ui/Card/CardActionsBuilder';
import { TweenConfig } from '@/game/types/TweenConfig';
import { TextWindowConfig } from '@/game/ui/TextWindow/TextWindowConfig';

export type AlignType = 
    | typeof LEFT 
    | typeof CENTER 
    | typeof RIGHT;

export class CardBattlePhase {
    protected cardBattle: CardBattle;
    #textWindows: TextWindow[] = [];
    #commandWindow: CommandWindow;
    #board: BoardWindow;
    #opponentBoard: BoardWindow;
    #cardset: Cardset;
    #opponentCardset: Cardset;
    #fieldCardset: Cardset;
    
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
                if (index > 0) window.close({ onComplete: () => window.destroy()})
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

    openAllWindows(config?: TweenConfig): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (!index) return window.open(config);
                window.open();
            });
        }
    }

    closeAllWindows(config?: TweenConfig): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (!index) return window.close(config);
                window.close();
            });
        }
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

    createBoard(boardData: BoardWindowData): void {
        this.#board = BoardWindow.createBottom(this.scene, boardData, 0x3C64DE);
    }

    addBoardZonePoints(boardZone: BoardZones, value: number): void {
        this.#board.addZonePoints(boardZone, value);
    }

    removeBoardZonePoints(boardZone: BoardZones, value: number): void {
        this.#board.removeZonePoints(boardZone, value);
    }

    addBoardColorPoints(cardColor: CardColors, value: number): void {
        this.#board.addColorPoints(cardColor, value);
    }

    addBoardPass(): void {
        this.#board.setPass(true);
    }

    removeBoardPass(): void {
        this.#board.setPass(false);
    }

    openBoard(config?: TweenConfig): void {
        this.#board.open(config);
    }

    closeBoard(config?: TweenConfig): void {
        this.#board.close(config);
    }

    destroyBoard(): void {
        if (this.#board) this.#board.destroy();
    }

    createOpponentBoard(opponentBoardData: BoardWindowData): void {
        this.#opponentBoard = BoardWindow.createTopReverse(this.scene, opponentBoardData, 0xDE3C5A);
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

    addOpponentBoardPass(): void {
        this.#opponentBoard.setPass(true);
    }

    removeOpponentBoardPass(): void {
        this.#opponentBoard.setPass(false);
    }

    openOpponentBoard(config?: TweenConfig): void {
        this.#opponentBoard.open(config);
    }

    closeOpponentBoard(config?: TweenConfig): void {
        this.#opponentBoard.close(config);
    }

    destroyOpponentBoard(): void {
        if (this.#opponentBoard) this.#opponentBoard.destroy();
    }

    createCardset(cards: CardData[]): Cardset {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
        const y = (this.#board.y - (this.#board.height / 2)) - CARD_HEIGHT - 10; 
        const cardset = Cardset.create(this.scene, cards, x, y);
        this.#cardset = cardset;
        return cardset;
    }

    createHandCardset(cards: CardData[]): Cardset {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
        const y = this.scene.cameras.main.centerY; 
        const cardset = Cardset.create(this.scene, cards, x, y);
        this.#cardset = cardset;
        return cardset;
    }

    getCardset(): Cardset {
        return this.#cardset;
    }

    openCardset(config?: TweenConfig & { faceUp?: boolean }): void {
        const openConfig: TimelineConfig<CardUi> = {
            targets: this.getCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume  }: TimelineEvent<CardUi>) => {
                pause();
                const builder = CardActionsBuilder
                    .create(card)
                    .open({
                        delay: (index! * 100),
                        onComplete: () => resume()
                    });
                if (config?.faceUp) builder.faceUp();
                builder.play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(openConfig);
    }

    closeCardset(config: TweenConfig): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.getCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume  }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({
                        delay: (index! * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                if (config.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(closeConfig);
    }

    destroyCardset(): void {
        if (this.#cardset) this.#cardset.destroy();
    }

    createOpponentCardset(cards: CardData[]): Cardset {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3));
        const y = (this.#opponentBoard.y + (this.#opponentBoard.height / 2)) + 10;
        const cardset = Cardset.create(this.scene, cards, x, y);
        this.#opponentCardset = cardset;
        return cardset;
    }

    getOpponentCardset(): Cardset {
        return this.#opponentCardset;
    }

    destroyOpponentCardset(): void {
        if (this.#opponentCardset) this.#opponentCardset.destroy();
    }

    createFieldCardset(config: { cards: CardData[], faceUp?: boolean } = { cards: [], faceUp: false }): Cardset {
        console.log('destroyFieldCardset', config.faceUp);
        this.destroyFieldCardset();
        const x = (this.scene.cameras.main.centerX - ((CARD_WIDTH * 3) / 2));
        const y = (this.scene.cameras.main.centerY - (CARD_HEIGHT / 2));
        const cardset = Cardset.create(this.scene, config.cards, x, y, config.faceUp);
        this.#fieldCardset = cardset;
        return cardset;
    }

    getFieldCardset(): Cardset {
        return this.#fieldCardset;
    }

    getFieldCardById(cardId: string): Card {
        return this.getFieldCardset().getCardById(cardId);
    }

    removeFieldCardById(cardId: string): void {
        this.getFieldCardset().removeCardById(cardId);
    }

    openFieldCardset(config?: TweenConfig & { faceUp?: boolean }): void {
        if (this.getFieldCardset().isOpened()) {
            if (config?.onComplete) config.onComplete();
            return;
        }
        const cardsUi = this.getFieldCardset().getCardsUi();
        const openConfig = { delay: 100 };
        this.#openCardset(cardsUi, { ...config, ...openConfig });
    }

    #openCardset(cardsUi: CardUi[], config?: TweenConfig & { faceUp?: boolean }): void {
        const openConfig: TimelineConfig<CardUi> = {
            targets: cardsUi,
            onStart: ({ target: { card }, index, pause, resume  }: TimelineEvent<CardUi>) => {
                pause();
                const builder = CardActionsBuilder
                    .create(card)
                    .open({
                        delay: (index! * 100),
                        onComplete: () => resume()
                    });
                if (config?.faceUp) builder.faceUp();
                builder.play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(openConfig);
    }

    openFieldCardsetCardByIndex(index: number, config?: TweenConfig & { faceUp?: boolean }): void {
        if (!this.getFieldCardset().isValidIndex(index)) {
            throw new Error(`Cardset: index ${index} is out of bounds.`);
        }
        const card = this.getFieldCardset().getCardByIndex(index);
        const cardsUi = [card.getUi()];
        this.#openCardset(cardsUi, config);
    }

    closeFieldCardset(config?: TweenConfig): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.getFieldCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume  }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({
                        delay: (index! * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(closeConfig);
    }

    destroyFieldCardset(): void {
        if (this.#fieldCardset) this.#fieldCardset.destroy();
    }

    createWaitingWindow(text: string = 'Waiting for opponent...'): void {
        this.createTextWindowCentered(text, { textAlign: 'center' });
    }
}