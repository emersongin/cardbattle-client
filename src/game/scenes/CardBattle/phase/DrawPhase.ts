import { BoardWindowData } from "@objects/BoardWindowData";
import { LoadPhase } from "@scenes/CardBattle/phase/LoadPhase";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { DECK, HAND } from "@/game/constants/keys";
import { TweenConfig } from "@/game/types/TweenConfig";

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
            this.#moveDrawedCardsToBoards();
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
            const cardset = await super.createCardset(playerCards);
            const widthEdge = this.scene.scale.width;
            cardset.setCardsInLinePosition(widthEdge, 0);
            resolve();
        });
    }

    #createOpponentDrawCardset(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const opponentCards = await this.cardBattle.getOpponentCardsFromHand(this.scene.room.playerId);
            const cardset = await super.createOpponentCardset(opponentCards);
            const widthEdge = this.scene.scale.width;
            cardset.setCardsInLinePosition(widthEdge, 0);
            resolve();
        });
    }

    #moveDrawedCardsToBoards(): void {
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => {
                    super.movePlayerCardsetToBoard({ ...t,
                        onStartEach: () => {
                            this.addBoardZonePoints(HAND, 1);
                            this.removeBoardZonePoints(DECK, 1);
                        },
                        onComplete: () => super.flipPlayerCardset(t)
                    });
                },
                (t?: TweenConfig) => super.moveOpponentCardsetToBoard(t),
            ],
            onAllComplete: () => { 
                this.#addColorCardToBoards();
            },
        });
    }

    #addColorCardToBoards() {
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => super.flashPlayerCardset({ 
                    ...t,
                    onStartEach: (card) => this.addBoardColorPoints(card.getColor(), 1),
                }),
                (t?: TweenConfig) => super.flashOpponentCardset({ 
                    ...t,
                    onStartEach: (card) => this.addOpponentBoardColorPoints(card.getColor(), 1),
                })
            ],
            onAllComplete: () => {
                this.#addOnCompleteListener();
            },
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
            this.#closeGameBoard();
        };
        keyboard.once('keydown-ENTER', onKeyDown, this);
    }

    #closeGameBoard(): void {
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => super.closeBoard(t),
                (t?: TweenConfig) => super.closeOpponentBoard(t),
                (t?: TweenConfig) => super.closeCardset(t),
                (t?: TweenConfig) => super.closeOpponentCardset(t),
            ],
            onAllComplete: () => this.changeToLoadPhase(),
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