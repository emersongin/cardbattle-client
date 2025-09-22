import { CardBattle } from "@api/CardBattle";
import { LEFT, CENTER, RIGHT, AP, HP } from '@constants/keys';
import { CARD_HEIGHT, CARD_WIDTH } from '@constants/default';
import { CardBattleScene } from '@scenes/CardBattle/CardBattleScene';
import { TimelineConfig, TimelineEvent } from '@scenes/VueScene';
import { BoardWindowData } from '@objects/BoardWindowData';
import { CardData } from '@objects/CardData';
import { CardColorsType } from '@game/types/CardColorsType';
import { TweenConfig } from '@game/types/TweenConfig';
import { BoardZonesType } from '@game/types/BoardZonesType';
import { TextWindow } from '@ui/TextWindow/TextWindow';
import { CommandWindow } from '@ui/CommandWindow/CommandWindow';
import { BoardWindow } from '@ui/BoardWindow/BoardWindow';
import { Cardset } from '@ui/Cardset/Cardset';
import { Card } from '@ui/Card/Card';
import { CardUi } from '@ui/Card/CardUi';
import { CommandOption } from '@ui/CommandWindow/CommandOption';
import { CardActionsBuilder } from '@ui/Card/CardActionsBuilder';
import { TextWindowConfig } from '@ui/TextWindow/TextWindowConfig';
import { BattlePointsData } from "@/game/objects/BattlePointsData";
import { ORANGE } from "@/game/constants/colors";

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

    // TEXT WINDOWS
    createTextWindowTop(text: string, config: Partial<TextWindowConfig>): void {
        this.destroyAllTextWindows();
        this.#textWindows[0] = this.#createTextWindowTop(text, config);
    }

    destroyAllTextWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach(window => window.destroy());
            this.#textWindows = [];
        }
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

    #closeAllChildWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (index > 0) window.close({ onComplete: () => window.destroy()})
            });
        }
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

    addTextWindow(title: string, config?: Partial<TextWindowConfig>): void {
        if (!this.#textWindows.length) {
            throw new Error('You should create a text window first.');
        }
        if (!config) config = {};
        config.relativeParent = this.#getLastTextWindow();
        config.onStartClose = () => {}; // null
        this.#textWindows.push(this.#createTextWindowCentered(title, config));
    }

    #getLastTextWindow(): TextWindow {
        return this.#textWindows[this.#textWindows.length - 1];
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

    createWaitingWindow(text: string = 'Waiting for opponent...'): void {
        this.createTextWindowCentered(text, { textAlign: 'center' });
    }

    // COMMAND WINDOW
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

    // PLAYER BOARD
    createBoard(boardData: BoardWindowData): void {
        this.#board = BoardWindow.createBottom(this.scene, boardData, 0x3C64DE);
    }

    setBattlePointsWithDuration(config: TweenConfig & BattlePointsData): void {
        this.#board.setBattlePointsWithDuration(config[AP], config[HP], config.onComplete);
    }

    addBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        const lastValue = this.#board.getZonePoints(boardZone);
        this.#board.setZonePoints(boardZone, (lastValue + value));
    }

    removeBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        const lastValue = this.#board.getZonePoints(boardZone);
        this.#board.setZonePoints(boardZone, (lastValue - value));
    }

    addBoardColorPoints(cardColor: CardColorsType, value: number): void {
        const lastValue = this.#board.getColorPoints(cardColor);
        this.#board.setColorPoints(cardColor, (lastValue + value));
    }

    removeBoardColorPoints(cardColor: CardColorsType, value: number): void {
        const lastValue = this.#board.getColorPoints(cardColor);
        this.#board.setColorPoints(cardColor, (lastValue - value));
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

    // OPPONENT BOARD
    createOpponentBoard(opponentBoardData: BoardWindowData): void {
        this.#opponentBoard = BoardWindow.createTopReverse(this.scene, opponentBoardData, 0xDE3C5A);
    }

    setOpponentBoardBattlePointsWithDuration(config: TweenConfig & BattlePointsData): void {
        this.#opponentBoard.setBattlePointsWithDuration(config[AP], config[HP], config.onComplete);
    }

    addOpponentBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        const lastValue = this.#opponentBoard.getZonePoints(boardZone);
        this.#opponentBoard.setZonePoints(boardZone, (lastValue + value));
    }

    removeOpponentBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        const lastValue = this.#opponentBoard.getZonePoints(boardZone);
        this.#opponentBoard.setZonePoints(boardZone, (lastValue - value));
    }

    addOpponentBoardColorPoints(cardColor: CardColorsType, value: number): void {
        const lastValue = this.#opponentBoard.getColorPoints(cardColor);
        this.#opponentBoard.setColorPoints(cardColor, (lastValue + value));
    }

    removeOpponentBoardColorPoints(cardColor: CardColorsType, value: number): void {
        const lastValue = this.#opponentBoard.getColorPoints(cardColor);
        this.#opponentBoard.setColorPoints(cardColor, (lastValue - value));
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
    
    // PLAYER CARDSET
    createCardset(cards: CardData[]): Cardset {
        this.destroyCardset();
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
        const y = (this.#board.y - (this.#board.height / 2)) - CARD_HEIGHT - 10; 
        const cardset = Cardset.create(this.scene, cards, x, y);
        cardset.setCardsInLinePosition();
        cardset.setCardsClosed();
        this.#cardset = cardset;
        return cardset;
    }

    createHandCardset(cards: CardData[]): Cardset {
        this.destroyCardset();
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
        const y = this.scene.cameras.main.centerY; 
        const cardset = Cardset.create(this.scene, cards, x, y);
        cardset.setCardsInLinePosition();
        cardset.setCardsClosed();
        this.#cardset = cardset;
        return cardset;
    }

    getCardset(): Cardset {
        return this.#cardset;
    }

    openCardset(config?: TweenConfig): void {
        const cardsUi = this.getCardset().getCardsUi();
        const openConfig = { delay: 100 };
        this.#openCardset(cardsUi, { ...config, ...openConfig });
    }

    closeCardset(config?: TweenConfig): void {
        const cardsUi = this.getCardset().getCardsUi();
        this.#closeCardset(cardsUi, config);
    }

    flipPlayerCardSet(config?: TweenConfig) {
        const cardsUis = this.getCardset().getCardsUi();
        this.#flipCardSet(cardsUis, config);
    }

    flashPlayerCardSet(config: TweenConfig): void {
        const cardsUis = this.getCardset().getCardsUi();
        this.#flashCardSet(cardsUis, config);
    }

    movePlayerCardSetToBoard(config: TweenConfig): void {
        const cardsUis = this.getCardset().getCardsUi();
        this.#moveCardSetToBoard(cardsUis, config);
    }

    destroyCardset(): void {
        if (this.#cardset) this.#cardset.destroy();
    }

    // OPPONENT CARDSET
    createOpponentCardset(cards: CardData[]): Cardset {
        this.destroyOpponentCardset();
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3));
        const y = (this.#opponentBoard.y + (this.#opponentBoard.height / 2)) + 10;
        const cardset = Cardset.create(this.scene, cards, x, y);
        cardset.setCardsInLinePosition();
        cardset.setCardsClosed();
        this.#opponentCardset = cardset;
        return cardset;
    }

    getOpponentCardset(): Cardset {
        return this.#opponentCardset;
    }

    openOpponentCardset(config?: TweenConfig): void {
        const cardsUi = this.getOpponentCardset().getCardsUi();
        const openConfig = { delay: 100 };
        this.#openCardset(cardsUi, { ...config, ...openConfig });
    }

    closeOpponentCardset(config?: TweenConfig): void {
        const cardsUi = this.getOpponentCardset().getCardsUi();
        this.#closeCardset(cardsUi, config);
    }

    flipOpponentCardSet(config?: TweenConfig): void {
        const cardsUis = this.getOpponentCardset().getCardsUi();
        this.#flipCardSet(cardsUis, config);
    }

    flashOpponentCardSet(config?: TweenConfig): void {
        const cardsUis = this.getOpponentCardset().getCardsUi();
        this.#flashCardSet(cardsUis, config);
    }

    moveOpponentCardSetToBoard(config?: TweenConfig): void {
        const cardsUis = this.getOpponentCardset().getCardsUi();
        this.#moveCardSetToBoard(cardsUis, config);
    }

    destroyOpponentCardset(): void {
        if (this.#opponentCardset) this.#opponentCardset.destroy();
    }

    // FIELD CARDSET
    createFieldCardset(config: { cards: CardData[], faceUp?: boolean } = { cards: [], faceUp: false }): Cardset {
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

    openFieldCardsetCardByIndex(index: number, config?: TweenConfig & { faceUp?: boolean }): void {
        if (!this.getFieldCardset().isValidIndex(index)) {
            throw new Error(`Cardset: index ${index} is out of bounds.`);
        }
        const card = this.getFieldCardset().getCardByIndex(index);
        const cardsUi = [card.getUi()];
        this.#openCardset(cardsUi, config);
    }

    closeFieldCardset(config?: TweenConfig): void {
        const cardsUi = this.getFieldCardset().getCardsUi();
        this.#closeCardset(cardsUi, config);
    }

    destroyFieldCardset(): void {
        if (this.#fieldCardset) this.#fieldCardset.destroy();
    }

    // SHARED
    #openCardset(cardsUi: CardUi[], config?: TweenConfig): void {
        const openConfig: TimelineConfig<CardUi> = {
            targets: cardsUi,
            onStart: ({ target: { card }, index, pause, resume  }: TimelineEvent<CardUi>) => {
                pause();
                const builder = CardActionsBuilder
                    .create(card);
                if (config?.faceUp) builder.faceUp();
                builder
                    .open({
                        delay: (index! * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(openConfig);
    }

    #closeCardset(cardsUi: CardUi[], config?: TweenConfig): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: cardsUi,
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

    #flipCardSet(cardsUi: CardUi[], config?: TweenConfig) {
        const flipConfig: TimelineConfig<CardUi> = {
            targets: cardsUi,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({ delay: (index! * 200) })
                    .faceUp()
                    .open({ onComplete: () => resume() })
                    .play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(flipConfig);
    }

    #flashCardSet(cardsUi: CardUi[], config?: TweenConfig): void {
        const flashConfig: TimelineConfig<CardUi> = {
            targets: cardsUi,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return resume();
                pause();
                CardActionsBuilder
                    .create(card)
                    .flash({
                        color: 0xffffff,
                        delay: (index! * 200),
                        onStart: () => {
                            if (config?.onStartEach) config.onStartEach(card);
                        },
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(flashConfig);
    }

    #moveCardSetToBoard(cardsUi: CardUi[], config?: TweenConfig): void {
        const totalCards = this.getCardset().getCardsTotal();
        const moveConfig = {
            targets: cardsUi,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .open({ delay: 0, duration: 0 })
                    .move({
                        xTo: (index! * CARD_WIDTH),
                        yTo: 0,
                        delay: (index! * 100), 
                        duration: (300 / totalCards) * (totalCards - index!),
                        onStart: () => {
                            if (config?.onStartEach) config.onStartEach();
                        },
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
            }
        };
        this.scene.timeline(moveConfig);
    }
}