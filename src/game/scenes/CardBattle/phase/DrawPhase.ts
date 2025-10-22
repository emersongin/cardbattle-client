import { LoadPhase } from "@scenes/CardBattle/phase/LoadPhase";
import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { DECK, HAND } from "@game/constants/keys";
import { TweenConfig } from "@game/types/TweenConfig";
import { BoardWindow } from "@game/ui/BoardWindow/BoardWindow";

export class DrawPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        const opponentBoard = await this.cardBattle.getOpponentBoard(this.scene.getPlayerId());
        const playerBoard = await this.cardBattle.getBoard(this.scene.getPlayerId());
        await this.cardBattle.setReadyDrawCards(this.scene.getPlayerId());
        if (await this.cardBattle.isOpponentReadyDrawCards(this.scene.getPlayerId())) {
            this.#loadDrawPhase(playerBoard, opponentBoard);
            return;
        }
        this.#createOpponentDrawCardsWaitingWindow();
        super.openAllWindows({
            onComplete: async () => {
                await this.cardBattle.listenOpponentDrawCards(this.scene.getPlayerId(), async () => {
                    super.closeAllWindows({ onComplete: () => this.#loadDrawPhase(playerBoard, opponentBoard) });
                });
            }
        });
    }

    #createOpponentDrawCardsWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to draw cards...');
    }

    #loadDrawPhase(playerBoard: BoardWindow, opponentBoard: BoardWindow): void {
        this.#createDrawPhaseWindows(async () => {
            await Promise.all([
                super.addOpponentBoard(opponentBoard),
                super.addBoard(playerBoard),
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
            const playerCards = await this.cardBattle.getCardsFromHand(this.scene.getPlayerId());
            await super.createCardset(playerCards);
            const widthEdge = this.scene.scale.width;
            const cardset = super.getCardset();
            cardset.setCardsInLinePosition(widthEdge, 0);
            cardset.setFaceDownAllCards();
            cardset.setShrinkAllCards();
            resolve();
        });
    }

    #createOpponentDrawCardset(): Promise<void> {
        return new Promise<void>(async (resolve) => {
            const opponentCards = await this.cardBattle.getOpponentCardsFromHand(this.scene.getPlayerId());
            await super.createOpponentCardset(opponentCards);
            const widthEdge = this.scene.scale.width;
            const cardset = super.getOpponentCardset();
            cardset.setCardsInLinePosition(widthEdge, 0);
            cardset.setFaceDownAllCards();
            cardset.setShrinkAllCards();
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
                (t?: TweenConfig) => 
                    super.moveOpponentCardsetToBoard({ ...t,
                        onStartEach: () => {
                            this.addOpponentBoardZonePoints(HAND, 1);
                            this.removeOpponentBoardZonePoints(DECK, 1);
                        },
                    }),
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
                this.scene.addKeyEnterListeningOnce({
                    onTrigger: async () => {
                        await super.closeGameBoard();
                        this.changeToLoadPhase();
                    }
                });
            },
        });
    }

    changeToLoadPhase(): void {
        this.scene.changePhase(new LoadPhase(this.scene));
    }
}