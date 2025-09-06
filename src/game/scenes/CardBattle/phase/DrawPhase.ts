import { ORANGE } from "@constants/colors";
import { DECK, HAND } from "@constants/keys";
import { CARD_WIDTH } from "@constants/default";
import { BoardWindowData } from "@objects/BoardWindowData";
import { TimelineConfig, TimelineEvent } from "@scenes/VueScene";
import { LoadPhase } from "@scenes/CardBattle/phase/LoadPhase";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CardUi } from "@ui/Card/CardUi";
import { CardActionsBuilder } from "@ui/Card/CardActionsBuilder";

export class DrawPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        const opponentBoardData = await this.cardBattle.getOpponentBoard(this.scene.room.playerId);
        const playerBoardData = await this.cardBattle.getBoard(this.scene.room.playerId);
        await this.cardBattle.setReadyDrawCards(this.scene.room.playerId);
        if (await this.cardBattle.isOpponentReadyDrawCards(this.scene.room.playerId)) {
            this.#loadDrawPhase(playerBoardData, opponentBoardData);
            return;
        }
        this.#createOpponentDrawCardsWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentDrawCards(this.scene.room.playerId, async () => {
                    super.closeAllWindows({ onComplete: () => this.#loadDrawPhase(playerBoardData, opponentBoardData) });
                });
            }
        });
    }

    #createOpponentDrawCardsWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to draw cards...');
    }

    #loadDrawPhase(playerBoardData: BoardWindowData, opponentBoardData: BoardWindowData): void {
        this.#createDrawPhaseWindows(async () => {
            await Promise.all([
                super.createOpponentBoard(opponentBoardData),
                super.createBoard(playerBoardData),
                this.#createOpponentDrawCardset(),
                this.#createPlayerDrawCardset()
            ]);
            super.openBoard();
            super.openOpponentBoard();
            this.#moveCardSetsToBoards();
        });
        super.openAllWindows();
    }

    #createDrawPhaseWindows(onClose: () => void): void {
        super.createTextWindowCentered('Draw Phase', { textAlign: 'center', onClose });
        super.addTextWindow('6 cards will be draw.');
    }

    #createPlayerDrawCardset(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const playerCards = await this.cardBattle.getHandCards(this.scene.room.playerId);
            const cardset = super.createCardset(playerCards);
            const widthEdge = this.scene.scale.width;
            cardset.setCardsInLinePosition(widthEdge, 0);
            resolve();
        });
    }

    #createOpponentDrawCardset(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const opponentCards = await this.cardBattle.getOpponentHandCards(this.scene.room.playerId);
            const cardset = super.createOpponentCardset(opponentCards);
            const widthEdge = this.scene.scale.width;
            cardset.setCardsInLinePosition(widthEdge, 0);
            resolve();
        });
    }

    #moveCardSetsToBoards(): void {
        this.#movePlayerCardSetToBoard();
        this.#moveOpponentCardSetToBoard();
    }

    #movePlayerCardSetToBoard(): void {
        const totalCards = this.getCardset().getCardsTotal();
        const moveConfig = {
            targets: this.getCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .move({
                        xTo: (index! * CARD_WIDTH),
                        yTo: 0,
                        delay: (index! * 100), 
                        duration: (300 / totalCards) * (totalCards - index!),
                        onStart: () => {
                            super.addBoardZonePoints(HAND, 1);
                            super.removeBoardZonePoints(DECK, 1);
                        },
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => this.#flipPlayerCardSet()
        };
        this.scene.timeline(moveConfig);
    }

    #flipPlayerCardSet() {
        const flipConfig: TimelineConfig<CardUi> = {
            targets: this.getCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({ open: false, delay: (index! * 200) })
                    .faceUp()
                    .open({ open: true, onComplete: () => resume() })
                    .play();
            },
            onAllComplete: () => {
                this.#flashPlayerCardSet();
                this.#flashOpponentCardSet();
            }
        };
        this.scene.timeline(flipConfig);
    }

    #flashPlayerCardSet(): void {
        const flashConfig: TimelineConfig<CardUi> = {
            targets: this.getCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return resume();
                pause();
                CardActionsBuilder
                    .create(card)
                    .flash({
                        color: 0xffffff,
                        delay: (index! * 100),
                        onStart: () => super.addBoardColorPoints(card.getColor(), 1),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: () => this.#addOnCompleteListener()
        };
        this.scene.timeline(flashConfig);
    }

    #addOnCompleteListener() {
        const keyboard = this.scene.input.keyboard;
        if (!keyboard) {
            throw new Error('Keyboard input is not available in this scene.');
        }
        const onKeyDown = () => {
            if (!keyboard) {
                throw new Error('Keyboard input is not available in this scene.');
            }
            keyboard.removeAllListeners();
            this.#closeWindows();
            this.#closeCardSets();
        };
        keyboard.once('keydown-ENTER', onKeyDown, this);
    }

    #closeWindows(): void {
        this.closeBoard();
        this.closeOpponentBoard();
    }

    #closeCardSets(): void {
        this.#closePlayerCardSet();
        this.#closeOpponentCardSet();
    }

    #closePlayerCardSet(): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.getCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({
                        open: false,
                        delay: (index! * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: async () => {
                await this.cardBattle.setPointsToBoard(this.scene.room.playerId);
                if (await this.cardBattle.hasOpponentDefinedPointsToBoard(this.scene.room.playerId)) {
                    this.changeToLoadPhase()
                    return;
                }
                this.#createSetPointsToBoardOpponentWaitingWindow();
                super.openAllWindows({
                    onComplete: async () => {
                        await this.cardBattle.listenOpponentSetPointsToBoard(this.scene.room.playerId, async () => {
                            super.closeAllWindows({ onComplete: () => this.changeToLoadPhase() });
                        });
                    }
                });
            }
        };
        this.scene.timeline(closeConfig);
    }

    #createSetPointsToBoardOpponentWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to set points to board...');
    }

    #closeOpponentCardSet(): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.getOpponentCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({
                        open: false,
                        delay: (index! * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
        };
        this.scene.timeline(closeConfig);
    }

    #flashOpponentCardSet(): void {
        const flashConfig: TimelineConfig<CardUi> = {
            targets: this.getOpponentCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return resume();
                pause();
                CardActionsBuilder
                    .create(card)
                    .flash({
                        color: 0xfffff,
                        delay: (index! * 100),
                        onStart: () => this.addOpponentBoardColorPoints(card.getColor(), 1),
                        onComplete: () => resume()
                    })
                    .play();
            }
        };
        this.scene.timeline(flashConfig);
    }

    #moveOpponentCardSetToBoard(): void {
        const totalCards = this.getOpponentCardset().getCardsTotal();
        const moveConfig = {
            targets: this.getOpponentCardset().getCardsUi(),
            x: 0,
            eachX: CARD_WIDTH,
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .move({
                        xFrom: card.getX(),
                        yFrom: card.getY(),
                        xTo: 0 + (index! * CARD_WIDTH),
                        yTo: 0,
                        delay: (index! * 100), 
                        duration: (300 / totalCards) * (totalCards - index!),
                        onStart: () => {
                            super.addOpponentBoardZonePoints(HAND, 1);
                            super.removeOpponentBoardZonePoints(DECK, 1);
                        },
                        onComplete: () => resume()
                    })
                    .play();
            },
        };
        this.scene.timeline(moveConfig);
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
        this.scene.changePhase(new LoadPhase(this.scene));
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

    destroy(): void {
        super.destroyAllTextWindows();
        super.destroyBoard();
        super.destroyOpponentBoard();
        this.destroyCardset();
        this.destroyOpponentCardset();
    }
}