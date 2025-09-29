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
import { Phase } from "./Phase";
import { CardsetEvents } from "@/game/ui/Cardset/CardsetEvents";

export type AlignType = 
    | typeof LEFT 
    | typeof CENTER 
    | typeof RIGHT;

export class CardBattlePhase implements Phase {
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

    create(_p?: any): void {
        throw new Error("Method not implemented.");
    }

    // TEXT WINDOWS
    createTextWindowTop(text: string, config: Partial<TextWindowConfig>): void {
        this.#textWindows = [];
        this.#textWindows[0] = this.#createTextWindowTop(text, config);
    }

    #createTextWindowTop(text: string, config: Partial<TextWindowConfig>): TextWindow {
        const windowConfig = {
            textAlign: config.textAlign || 'left',
            textColor: config.textColor || '#ffffff',
            relativeParent: config.relativeParent,
            onStartClose: () => this.#onStartCloseAllChildrenWindows(),
            onClose: config.onClose
        };
        return TextWindow.createTop(this.scene, { ...windowConfig, text });
    }

    #onStartCloseAllChildrenWindows(): void {
        if (this.#textWindows.length) {
            this.#textWindows.forEach((window, index) => {
                if (index > 0) window.close({ onComplete: () => window.destroy()})
            });
        }
    }

    createTextWindowCentered(title: string, config: Partial<TextWindowConfig>): Promise<void> {
        return new Promise<void>(resolve => {
            this.#textWindows = [];
            this.#textWindows[0] = this.#createTextWindowCentered(title, config);
            resolve();
        });
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

    createWaitingWindow(text: string = 'Waiting for opponent...'): void {
        this.createTextWindowCentered(text, { textAlign: 'center' });
    }

    createHandDisplayWindows(): void {
        this.createTextWindowTop('Your Hand', {
            textAlign: 'center',
        });
        this.addTextWindow('...', { marginTop: 32 });
        this.addTextWindow('...');
        this.addTextWindow('...');
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

    closeAllWindows(config?: TweenConfig): Promise<void> {
        return new Promise<void>(resolve => {
            this.#textWindows.forEach((window, index) => {
                if (!index && window.isOpen()) {
                    return window.close({ 
                        ...config, 
                        onComplete: () => {
                            if (config?.onComplete) config.onComplete();
                            resolve();
                        }
                    });
                } else {
                    if (config?.onComplete) config.onComplete();
                    resolve();
                }
                window.close();
            });
        });
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

    // PLAYER BOARD
    createBoard(boardData: BoardWindowData): void {
        this.#board = BoardWindow.createBottom(this.scene, boardData, 0x3C64DE);
    }

    getBoard(): BoardWindow {
        return this.#board;
    }

    setBattlePointsWithDuration(config: TweenConfig & BattlePointsData): void {
        this.#board.setBattlePointsWithDuration(config[AP], config[HP], config.onComplete);
    }

    addBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#board.addZonePoints(boardZone, value);
    }

    removeBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#board.removeZonePoints(boardZone, value);
    }

    addBoardColorPoints(cardColor: CardColorsType, value: number): void {
        this.#board.addColorPoints(cardColor, value);
    }

    removeBoardColorPoints(cardColor: CardColorsType, value: number): void {
        this.#board.removeColorPoints(cardColor, value);
    }

    setBoardPass(): void {
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

    // OPPONENT BOARD
    createOpponentBoard(opponentBoardData: BoardWindowData): void {
        this.#opponentBoard = BoardWindow.createTopReverse(this.scene, opponentBoardData, 0xDE3C5A);
    }

    setOpponentBoardBattlePointsWithDuration(config: TweenConfig & BattlePointsData): void {
        this.#opponentBoard.setBattlePointsWithDuration(config[AP], config[HP], config.onComplete);
    }

    addOpponentBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#opponentBoard.addZonePoints(boardZone, value);
    }

    removeOpponentBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#opponentBoard.removeZonePoints(boardZone, value);
    }

    addOpponentBoardColorPoints(cardColor: CardColorsType, value: number): void {
        this.#opponentBoard.addColorPoints(cardColor, value);
    }

    removeOpponentBoardColorPoints(cardColor: CardColorsType, value: number): void {
        this.#opponentBoard.removeColorPoints(cardColor, value);
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
    
    // PLAYER CARDSET
    createCardset(cards: CardData[]): Promise<void> {
        return new Promise(resolve => {
            const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
            const y = (this.#board.y - (this.#board.height / 2)) - CARD_HEIGHT - 10; 
            const cardset = Cardset.create(this.scene, cards, x, y);
            cardset.setCardsInLinePosition();
            cardset.setCardsClosed();
            this.#cardset = cardset;
            resolve();
        });
    }

    createHandCardset(cards: CardData[]): Promise<void> {
        return new Promise(resolve => {
            const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
            const y = this.scene.cameras.main.centerY; 
            const cardset = Cardset.create(this.scene, cards, x, y);
            cardset.setCardsInLinePosition();
            cardset.setCardsClosed();
            this.#cardset = cardset;
            resolve();
        });
    }

    getCardset(): Cardset {
        return this.#cardset;
    }

    openCardset(config?: TweenConfig): void {
        const cardset = this.getCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        const openConfig = { delay: 100 };
        this.#openCardset(cardset, { ...config, ...openConfig });
    }

    closeCardset(config?: TweenConfig): void {
        const cardset = this.getCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#closeCardset(cardset, config);
    }

    flipPlayerCardset(config?: TweenConfig) {
        const cardset = this.getCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#flipCardSet(cardset, config);
    }

    flashPlayerCardset(config: TweenConfig): void {
        const cardset = this.getCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#flashCardSet(cardset, config);
    }

    movePlayerCardsetToBoard(config: TweenConfig): void {
        const cardset = this.getCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#moveCardSetToBoard(cardset, config);
    }

    setSelectModeOnceCardset(events: CardsetEvents): void {
        const cardset = this.getCardset();
        if (!cardset) return (events?.onComplete) ? events.onComplete([]) : undefined;
        this.#setSelectModeOnceCardset(cardset, events);
    }

    setSelectModeMultCardset(events: CardsetEvents): void {
        const cardset = this.getCardset();
        if (!cardset) return (events?.onComplete) ? events.onComplete([]) : undefined;
        this.#setSelectModeMultCardset(cardset, events);
    }

    // OPPONENT CARDSET
    createOpponentCardset(cards: CardData[]): Promise<void> {
        return new Promise(resolve => {
            const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3));
            const y = (this.#opponentBoard.y + (this.#opponentBoard.height / 2)) + 10;
            const cardset = Cardset.create(this.scene, cards, x, y);
            cardset.setCardsInLinePosition();
            cardset.setCardsClosed();
            this.#opponentCardset = cardset;
            resolve();
        });
    }

    getOpponentCardset(): Cardset {
        return this.#opponentCardset;
    }

    openOpponentCardset(config?: TweenConfig): void {
        const cardset = this.getOpponentCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        const openConfig = { delay: 100 };
        this.#openCardset(cardset, { ...config, ...openConfig });
    }

    closeOpponentCardset(config?: TweenConfig): void {
        const cardset = this.getOpponentCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#closeCardset(cardset, config);
    }

    flipOpponentCardset(config?: TweenConfig): void {
        const cardset = this.getOpponentCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#flipCardSet(cardset, config);
    }

    flashOpponentCardset(config?: TweenConfig): void {
        const cardset = this.getOpponentCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#flashCardSet(cardset, config);
    }

    moveOpponentCardsetToBoard(config?: TweenConfig): void {
        const cardset = this.getOpponentCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#moveCardSetToBoard(cardset, config);
    }

    // FIELD CARDSET
    createPowerCardset(config: { cards: CardData[], faceUp?: boolean } = { cards: [], faceUp: false }): Promise<void> {
        return new Promise(resolve => {
            const x = (this.scene.cameras.main.centerX - ((CARD_WIDTH * 3) / 2));
            const y = (this.scene.cameras.main.centerY - (CARD_HEIGHT / 2));
            
            if (this.#fieldCardset) {
                const cards = this.#fieldCardset.getCards()
                if (cards) cards.forEach(card => card.getUi().destroy());
                this.#fieldCardset.destroy();
            }

            const cardset = Cardset.create(this.scene, config.cards, x, y, config.faceUp);
            cardset.setCardsInLinePosition();
            cardset.setCardsClosed();
            this.#fieldCardset = cardset;
            resolve();
        });
    }

    getPowerCardset(): Cardset {
        return this.#fieldCardset;
    }

    getCardFromPowerCardsetById(cardId: string): Card {
        return this.getPowerCardset().getCardById(cardId);
    }

    removeCardFromPowerCardsetById(cardId: string): void {
        this.getPowerCardset().removeCardById(cardId);
    }

    openPowerCardset(config?: TweenConfig & { faceUp?: boolean }): void {
        const cardset = this.getPowerCardset();
        if (!cardset || cardset.isOpened()) return (config?.onComplete) ? config.onComplete() : undefined;
        const openConfig = { delay: 100 };
        this.#openCardset(cardset, { ...config, ...openConfig });
    }

    openCardFromPowerCardsetByIndex(index: number, config?: TweenConfig & { faceUp?: boolean }): void {
        const cardset = this.getPowerCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#openCardset(cardset, config, index);
    }

    closePowerCardset(config?: TweenConfig): void {
        const cardset = this.getPowerCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#closeCardset(cardset, config);
    }

    movePowerCardsetToBoard(config?: TweenConfig): void {
        const cardset = this.getPowerCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#moveCardSetToBoard(cardset, config);
    }

    // SHARED
    #openCardset(cardset: Cardset, config?: TweenConfig, index?: number): void {
        let cardsUis = cardset.getCardsUi();
        if (index !== undefined) {
            const card = cardset.getCardByIndex(index);
            if (!card) return (config?.onComplete) ? config.onComplete() : undefined;
            cardsUis = [card.getUi()];
        }
        if (cardsUis.length === 0) return (config?.onComplete) ? config.onComplete() : undefined;
        const openConfig: TimelineConfig<CardUi> = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume  }: TimelineEvent<CardUi>) => {
                pause();
                const builder = CardActionsBuilder
                    .create(card);
                if (config?.faceUp) builder.faceUp();
                builder
                    .open({
                        delay: (index * 100),
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

    #closeCardset(cardset: Cardset, config?: TweenConfig): void {
        const cardsUis = cardset.getCardsUi();
        if (cardsUis.length === 0) return (config?.onComplete) ? config.onComplete() : undefined;
        const closeConfig: TimelineConfig<CardUi> = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume  }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({
                        delay: (index * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => {
                if (config?.onComplete) config.onComplete();
                cardset.destroy();
            }
        };
        this.scene.timeline(closeConfig);
    }

    #flipCardSet(cardset: Cardset, config?: TweenConfig) {
        const cardsUis = cardset.getCardsUi();
        if (cardsUis.length === 0) return (config?.onComplete) ? config.onComplete() : undefined;
        const flipConfig: TimelineConfig<CardUi> = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({ delay: (index * 200) })
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

    #flashCardSet(cardset: Cardset, config?: TweenConfig): void {
        const cardsUis = cardset.getCardsUi();
        if (cardsUis.length === 0) return (config?.onComplete) ? config.onComplete() : undefined;
        const flashConfig: TimelineConfig<CardUi> = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return resume();
                pause();
                CardActionsBuilder
                    .create(card)
                    .flash({
                        color: 0xffffff,
                        delay: (index * 200),
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

    #moveCardSetToBoard(cardset: Cardset, config?: TweenConfig): void {
        const cardsUis = cardset.getCardsUi();
        if (cardsUis.length === 0) return (config?.onComplete) ? config.onComplete() : undefined;
        const totalCards = cardset.getCardsTotal();
        const moveConfig = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .open({ delay: 0, duration: 0 })
                    .move({
                        xTo: (index * CARD_WIDTH),
                        yTo: 0,
                        delay: (index * 100), 
                        duration: (300 / totalCards) * (totalCards - index),
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

    #setSelectModeOnceCardset(cardset: Cardset, events: CardsetEvents): void {
        cardset.selectModeOne(events);
    }

    #setSelectModeMultCardset(cardset: Cardset, events: CardsetEvents): void {
        cardset.selectModeMany(events);
    }

    // GENERAL
    createGameBoard(config?: TweenConfig & { 
        isShowBattlePoints?: boolean, 
        powerCardsFaceUp?: boolean 
    }): Promise<void> {
        return new Promise(async resolve => {
            const board = await this.cardBattle.getBoard(this.scene.room.playerId);
            const opponentBoard = await this.cardBattle.getOpponentBoard(this.scene.room.playerId);
            const powerCards: CardData[] = await this.cardBattle.getFieldPowerCards();
            const battleCards: CardData[] = await this.cardBattle.getBattleCards(this.scene.room.playerId);
            const opponentBattleCards: CardData[] = await this.cardBattle.getOpponentBattleCards(this.scene.room.playerId);
            const promises = [];
            if (board) {
                const boardData = (config?.isShowBattlePoints ?? true) ? board : { ...board, [AP]: 0, [HP]: 0 };
                promises.push(this.createBoard(boardData));
            };
            if (opponentBoard) {
                const opponentBoardData = (config?.isShowBattlePoints ?? true) ? opponentBoard : { ...opponentBoard, [AP]: 0, [HP]: 0 };
                promises.push(this.createOpponentBoard(opponentBoardData));
            }
            if (powerCards) promises.push(this.createPowerCardset({ 
                cards: powerCards,
                faceUp: config?.isPowerCardsFaceUp ? true : false 
            }));
            if (config?.isPowerCardsFaceUp) {
                const powerCardset = this.getPowerCardset();
                powerCardset.setCardsInLinePosition();
                powerCardset.setCardsClosed();
            }
            if (battleCards) promises.push(this.createCardset(battleCards));
            if (opponentBattleCards) promises.push(this.createOpponentCardset(opponentBattleCards));
            await Promise.all(promises);
            if (config?.onComplete) config.onComplete();
            resolve();
        });
    }

    openGameBoard(config?: TweenConfig & { isOpponentCardsetOpen?: boolean }): Promise<void> {
        return new Promise<void>(resolve => {
            this.scene.timeline({
                targets: [
                    (config?: TweenConfig) => this.openOpponentBoard(config),
                    (config?: TweenConfig) => this.openBoard(config),
                    (config?: TweenConfig) => this.openPowerCardset({ ...config, faceUp: true }),
                    (config?: TweenConfig) => this.openOpponentCardset({ faceUp: (config?.isOpponentCardsetOpen ?? true), ...config }),
                    (config?: TweenConfig) => this.openCardset({ ...config, faceUp: true }),
                ],
                onAllComplete: () => {
                    if (config?.onComplete) config.onComplete();
                    resolve();
                },
            });
        });
    }

    closeGameBoard(config?: TweenConfig): Promise<void> {
        return new Promise<void>(resolve => {
            this.scene.timeline({
                targets: [
                    (config?: TweenConfig) => this.closeBoard(config),
                    (config?: TweenConfig) => this.closeOpponentBoard(config),
                    (config?: TweenConfig) => this.closePowerCardset(config),
                    (config?: TweenConfig) => this.closeCardset(config),
                    (config?: TweenConfig) => this.closeOpponentCardset(config),
                    (config?: TweenConfig) => this.closeAllWindows(config),
                ],
                onAllComplete: () => {
                    if (config?.onComplete) config.onComplete();
                    resolve();
                },
            });
        });
    }

    openHandZone(config?: TweenConfig): Promise<void> {
        return new Promise<void>(resolve => {
            this.scene.timeline({
                targets: [
                    (config?: TweenConfig) => this.openBoard(config),
                    (config?: TweenConfig) => this.openCardset({ ...config, faceUp: true }),
                ],
                onAllComplete: () => {
                    this.openAllWindows();
                    if (config?.onComplete) config.onComplete();
                    resolve();
                },
            });
        });
    }

    closeHandZone(config?: TweenConfig): Promise<void> {
        return new Promise<void>(resolve => {
            this.scene.timeline({
                targets: [
                    (config?: TweenConfig) => this.closeAllWindows(config),
                    (config?: TweenConfig) => this.closeBoard(config),
                    (config?: TweenConfig) => this.closeCardset(config),
                ],
                onAllComplete: () => {
                    if (config?.onComplete) config.onComplete();
                    resolve();
                },
            });
        });
    }

    changeToChallengePhase(): void {
        throw new Error("Method not implemented.");
    }
    
    changeToStartPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToDrawPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToLoadPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToTriggerPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToSummonPhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToCompilePhase(): void {
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }
}