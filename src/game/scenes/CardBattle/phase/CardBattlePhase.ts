import { CardBattle } from "@api/CardBattle";
import { LEFT, CENTER, RIGHT, AP, HP } from '@constants/keys';
import { CARD_HEIGHT, CARD_WIDTH } from '@constants/default';
import { CardBattleScene } from '@scenes/CardBattle/CardBattleScene';
import { TimelineConfig, TimelineEvent } from '@scenes/VueScene';
import { CardColorType } from '@game/types/CardColorType';
import { TweenConfig } from '@game/types/TweenConfig';
import { BoardZonesType } from '@game/types/BoardZonesType';
import { CommandWindow } from '@ui/CommandWindow/CommandWindow';
import { BoardWindow } from '@ui/BoardWindow/BoardWindow';
import { Cardset } from '@ui/Cardset/Cardset';
import { Card } from '@ui/Card/Card';
import { CardUi } from '@ui/Card/CardUi';
import { CommandOption } from '@ui/CommandWindow/CommandOption';
import { CardActionsBuilder } from '@ui/Card/CardActionsBuilder';
import { TextWindowConfig } from '@ui/TextWindows/TextWindowConfig';
import { BattlePoints } from "@game/objects/BattlePoints";
import { ORANGE } from "@game/constants/colors";
import { Phase } from "./Phase";
import { CardsetEvents } from "@game/ui/Cardset/CardsetEvents";
import { TextWindows } from "@game/ui/TextWindows/TextWindows";
import { PowerCard } from "@game/ui/Card/PowerCard";
import { BattleCard } from "@game/ui/Card/BattleCard";

export type AlignType = 
    | typeof LEFT 
    | typeof CENTER 
    | typeof RIGHT;

export class CardBattlePhase implements Phase {
    protected cardBattle: CardBattle;

    #textWindows: TextWindows;
    #commandWindow: CommandWindow;
    #board: BoardWindow;
    #opponentBoard: BoardWindow;
    #cardset: Cardset;
    #opponentCardset: Cardset;
    #fieldCardset: Cardset;
        
    constructor(readonly scene: CardBattleScene) {
        this.cardBattle = scene.getCardBattle();
        this.#textWindows = new TextWindows(scene);
    }

    create(_p?: any): void {
        throw new Error("Method not implemented.");
    }

    // TEXT WINDOWS
    createTextWindowTop(text: string, config: Partial<TextWindowConfig>): Promise<void> {
        return new Promise(resolve => {
            this.#textWindows.createTextWindowTop(text, config);
            resolve();
        });
    }

    createTextWindowCentered(text: string, config: Partial<TextWindowConfig>): Promise<void> {
        return new Promise(resolve => {
            this.#textWindows.createTextWindowCentered(text, config);
            resolve();
        });
    }

    createWaitingWindow(text: string = 'Waiting for opponent...'): void {
        this.createTextWindowCentered(text, { textAlign: 'center' });
    }

    createHandDisplayWindows(): void {
        this.createTextWindowTop('Your Hand', { textAlign: 'center' });
        this.addTextWindow('...', { marginTop: 32 });
        this.addTextWindow('...');
        this.addTextWindow('...');
    }

    addTextWindow(text: string, config?: Partial<TextWindowConfig>): void {
        this.#textWindows.addTextWindow(text, config);
    }

    setTextWindowText(text: string, index: number): void {
        this.#textWindows.setTextWindowText(text, index);
    }

    openAllWindows(config?: TweenConfig): void {
        this.#textWindows.openAllWindows(config);
    }

    closeAllWindows(config?: TweenConfig): Promise<void> {
        return new Promise(resolve => {
            this.#textWindows.closeAllWindows({ ...config, 
                onComplete: () => {
                    if (config?.onComplete) config.onComplete();
                    resolve();
                } 
            });
        });
    }

    // COMMAND WINDOW
    createCommandWindowCentered(text: string, options: CommandOption[]): void {
        this.#commandWindow = CommandWindow.createCentered(this.scene, text, options);
    }

    createCommandWindowBottom(text: string, options: CommandOption[]): void {
        this.#commandWindow = CommandWindow.createBottom(this.scene, text, options);
    }

    openCommandWindow(): void {
        this.#commandWindow.open();
    }

    // PLAYER BOARD
    addBoard(boardData: BoardWindow): void {
        this.#board = boardData;
    }

    getBoard(): BoardWindow {
        return this.#board;
    }

    setBattlePointsWithDuration(config: TweenConfig & BattlePoints): void {
        this.#board.setBattlePointsWithDuration(config[AP], config[HP], config.onComplete);
    }

    addBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#board.addZonePoints(boardZone, value);
    }

    removeBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#board.removeZonePoints(boardZone, value);
    }

    addBoardColorPoints(cardColor: CardColorType, value: number): void {
        this.#board.addColorPoints(cardColor, value);
    }

    removeBoardColorPoints(cardColor: CardColorType, value: number): void {
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
    addOpponentBoard(boardData: BoardWindow): void {
        this.#opponentBoard = boardData;
    }

    setOpponentBoardBattlePointsWithDuration(config: TweenConfig & BattlePoints): void {
        this.#opponentBoard.setBattlePointsWithDuration(config[AP], config[HP], config.onComplete);
    }

    addOpponentBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#opponentBoard.addZonePoints(boardZone, value);
    }

    removeOpponentBoardZonePoints(boardZone: BoardZonesType, value: number): void {
        this.#opponentBoard.removeZonePoints(boardZone, value);
    }

    addOpponentBoardColorPoints(cardColor: CardColorType, value: number): void {
        this.#opponentBoard.addColorPoints(cardColor, value);
    }

    removeOpponentBoardColorPoints(cardColor: CardColorType, value: number): void {
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
    createCardset(cards: Card[]): Promise<void> {
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

    createHandCardset(cards: Card[]): Promise<void> {
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
        this.#flipCardset(cardset, config);
    }

    flashPlayerCardset(config: TweenConfig): void {
        const cardset = this.getCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#flashCardset(cardset, config);
    }

    movePlayerCardsetToBoard(config: TweenConfig): void {
        const cardset = this.getCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#moveCardsetToBoard(cardset, config);
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
    createOpponentCardset(cards: Card[]): Promise<void> {
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
        this.#flipCardset(cardset, config);
    }

    flashOpponentCardset(config?: TweenConfig): void {
        const cardset = this.getOpponentCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#flashCardset(cardset, config);
    }

    moveOpponentCardsetToBoard(config?: TweenConfig): void {
        const cardset = this.getOpponentCardset();
        if (!cardset) return (config?.onComplete) ? config.onComplete() : undefined;
        this.#moveCardsetToBoard(cardset, config);
    }

    // FIELD CARDSET
    createPowerCardset(cards: PowerCard[]): Promise<void> {
        return new Promise(resolve => {
            const x = (this.scene.cameras.main.centerX - ((CARD_WIDTH * 3) / 2));
            const y = (this.scene.cameras.main.centerY - (CARD_HEIGHT / 2));
            if (this.#fieldCardset) {
                const cards = this.#fieldCardset.getCards()
                if (cards) cards.forEach(card => card.getUi().destroy());
                this.#fieldCardset.destroy();
            }
            const cardset = Cardset.create(this.scene, cards, x, y);
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

    openPowerCardset(config?: TweenConfig): void {
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
        this.#moveCardsetToBoard(cardset, config);
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
                        destroy: true,
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

    #flipCardset(cardset: Cardset, config?: TweenConfig) {
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

    #flashCardset(cardset: Cardset, config?: TweenConfig): void {
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

    #moveCardsetToBoard(cardset: Cardset, config?: TweenConfig): void {
        const cardsUis = cardset.getCardsUi();
        if (cardsUis.length === 0) return (config?.onComplete) ? config.onComplete() : undefined;
        const moveConfig = {
            targets: cardsUis,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .open({ delay: 0, duration: 0 })
                    .move({
                        toX: (index * CARD_WIDTH),
                        toY: 0,
                        delay: (index * 100), 
                        duration: 300,
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
        isOpponentBattleCardsFaceDown?: boolean,
    }): Promise<void> {
        return new Promise(async resolve => {
            const board = await this.cardBattle.getBoard(this.scene.getPlayerId());
            const opponentBoard = await this.cardBattle.getOpponentBoard(this.scene.getPlayerId());
            const powerCards: PowerCard[] = await this.cardBattle.getFieldPowerCards();
            const battleCards: BattleCard[] = await this.cardBattle.getBattleCards(this.scene.getPlayerId());
            let opponentBattleCards: BattleCard[] = await this.cardBattle.getOpponentBattleCards(this.scene.getPlayerId());
            if (config?.isOpponentBattleCardsFaceDown) {
                opponentBattleCards.forEach(card => card.faceDown());
            }            
            const promises = [];
            if (config?.isShowBattlePoints === false) {
                board.setBattlePoints(0, 0);
                opponentBoard.setBattlePoints(0, 0);
            }
            promises.push(this.addBoard(board));
            promises.push(this.addOpponentBoard(opponentBoard));
            if (powerCards) promises.push(this.createPowerCardset(powerCards));
            if (battleCards) promises.push(this.createCardset(battleCards));
            if (opponentBattleCards) promises.push(this.createOpponentCardset(opponentBattleCards));
            await Promise.all(promises);
            if (config?.onComplete) config.onComplete();
            resolve();
        });
    }

    openGameBoard(generalConfig?: TweenConfig): Promise<void> {
        return new Promise(resolve => {
            this.scene.timeline({
                targets: [
                    (config?: TweenConfig) => this.openOpponentBoard(config),
                    (config?: TweenConfig) => this.openBoard(config),
                    (config?: TweenConfig) => this.openPowerCardset({ ...config }),
                    (config?: TweenConfig) => this.openOpponentCardset({ ...config }),
                    (config?: TweenConfig) => this.openCardset({ ...config, faceUp: true }),
                ],
                onAllComplete: () => {
                    if (generalConfig?.onComplete) generalConfig.onComplete();
                    resolve();
                },
            });
        });
    }

    closeGameBoard(generalConfig?: TweenConfig): Promise<void> {
        return new Promise(resolve => {
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
                    if (generalConfig?.onComplete) generalConfig.onComplete();
                    resolve();
                },
            });
        });
    }

    openHandZone(generalConfig?: TweenConfig): Promise<void> {
        return new Promise(resolve => {
            this.scene.timeline({
                targets: [
                    (config?: TweenConfig) => this.openBoard(config),
                    (config?: TweenConfig) => this.openCardset({ ...config, faceUp: true }),
                ],
                onAllComplete: () => {
                    if (generalConfig?.onComplete) generalConfig.onComplete();
                    resolve();
                },
            });
        });
    }

    closeHandZone(generalConfig?: TweenConfig): Promise<void> {
        return new Promise(resolve => {
            this.scene.timeline({
                targets: [
                    (config?: TweenConfig) => this.closeBoard(config),
                    (config?: TweenConfig) => this.closeCardset(config),
                    (config?: TweenConfig) => this.closeAllWindows(config),
                ],
                onAllComplete: () => {
                    if (generalConfig?.onComplete) generalConfig.onComplete();
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