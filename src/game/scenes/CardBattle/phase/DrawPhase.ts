import { BoardWindowData } from "@objects/BoardWindowData";
import { TimelineConfig, TimelineEvent } from "@scenes/VueScene";
import { LoadPhase } from "@scenes/CardBattle/phase/LoadPhase";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CardUi } from "@ui/Card/CardUi";
import { CardActionsBuilder } from "@ui/Card/CardActionsBuilder";
import { DECK, HAND } from "@/game/constants/keys";

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
            const playerCards = await this.cardBattle.getCardsFromHand(this.scene.room.playerId);
            const cardset = super.createCardset(playerCards);
            const widthEdge = this.scene.scale.width;
            cardset.setCardsInLinePosition(widthEdge, 0);
            resolve();
        });
    }

    #createOpponentDrawCardset(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const opponentCards = await this.cardBattle.getOpponentCardsFromHand(this.scene.room.playerId);
            const cardset = super.createOpponentCardset(opponentCards);
            const widthEdge = this.scene.scale.width;
            cardset.setCardsInLinePosition(widthEdge, 0);
            resolve();
        });
    }

    #moveCardSetsToBoards(): void {
        super.movePlayerCardSetToBoard({ 
            onComplete: () => super.flipPlayerCardSet({
                onStartEach: () => {
                    this.addBoardZonePoints(HAND, 1);
                    this.removeBoardZonePoints(DECK, 1);
                },
                onComplete: () => { 
                    super.flashPlayerCardSet({
                        onStartEach: (card) => this.addBoardColorPoints(card.getColor(), 1),
                        onComplete: () => this.#addOnCompleteListener()
                    });
                    super.flashOpponentCardSet({
                        onStartEach: (card) => this.addOpponentBoardColorPoints(card.getColor(), 1),
                    });
                }
        })});
        super.moveOpponentCardSetToBoard({
            onStartEach: () => {
                this.addOpponentBoardZonePoints(HAND, 1);
                this.removeOpponentBoardZonePoints(DECK, 1);
            }
        });
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
                        delay: (index! * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
            onAllComplete: async () => this.changeToLoadPhase()
        };
        this.scene.timeline(closeConfig);
    }

    #closeOpponentCardSet(): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.getOpponentCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                CardActionsBuilder
                    .create(card)
                    .close({
                        delay: (index! * 100),
                        onComplete: () => resume()
                    })
                    .play();
            },
        };
        this.scene.timeline(closeConfig);
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