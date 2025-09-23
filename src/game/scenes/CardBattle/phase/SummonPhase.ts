import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CardData } from "@/game/objects/CardData";
import { BoardWindowData } from "@/game/objects/BoardWindowData";
import { CompilePhase } from "@scenes/CardBattle/phase/CompilePhase";
import { TweenConfig } from "@/game/types/TweenConfig";
import { ORANGE } from "@/game/constants/colors";
import { CardColorsType } from "@/game/types/CardColorsType";
export class SummonPhase extends CardBattlePhase implements Phase {

    create(): void {
        super.createTextWindowCentered('Summon Phase', {
            textAlign: 'center',
            onClose: () => this.#loadSummonPhase()
        });
        super.addTextWindow('Select and summon battle cards to the field.');
        super.openAllWindows();
    }

    async #loadSummonPhase(): Promise<void> {
        const boardData: BoardWindowData = await this.cardBattle.getBoard(this.scene.room.playerId);
        const cardsData: CardData[] = await this.cardBattle.getCardsFromHandInTheSummonPhase(this.scene.room.playerId);
        super.createBoard(boardData);
        super.createHandCardset(cardsData);
        super.createHandDisplayWindows();
        this.#openAndSelectModeHandCardset();
    }

    #openAndSelectModeHandCardset(): void {
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.openAllWindows(config),
                (config?: TweenConfig) => super.openBoard(config),
                (config?: TweenConfig) => super.openCardset({ ...config, faceUp: true }),
            ],
            onAllComplete: () => {
                super.setSelectModeMultCardset({
                    onHasEnoughColorPointsByColor: (cardId: string) => {
                        const card = super.getCardset().getCardById(cardId);
                        const cardColor = card.getColor();
                        const cardCost = card.getCost();
                        if (cardColor === ORANGE) return true;
                        return super.getBoard().hasEnoughColorPointsByColor(cardColor, cardCost);
                    },
                    onCreditPoint: (cardId: string) => {
                        const card = super.getCardset().getCardById(cardId);
                        const cardColor = card.getColor() as CardColorsType;
                        const cardCost = card.getCost();
                        if (cardColor === ORANGE) return;
                        if (cardCost > 0) super.getBoard().addColorPoints(cardColor, cardCost);
                    },
                    onDebitPoint: (cardId: string) => {
                        const card = super.getCardset().getCardById(cardId);
                        const cardColor = card.getColor() as CardColorsType;
                        const cardCost = card.getCost();
                        if (cardColor === ORANGE) return;
                        if (cardCost > 0) super.getBoard().removeColorPoints(cardColor, cardCost);
                    },
                    onChangeIndex: (cardId: string) => this.#onChangeHandCardsetIndex(cardId),
                    onComplete: (cardIds: string[]) => this.#onSelectHandCardsetCard(cardIds),
                });
            },
        });
    }

    #onChangeHandCardsetIndex(cardId: string): void {
        const cardset = super.getCardset();
        super.setTextWindowText(cardset.getCardById(cardId).getName(), 1);
        super.setTextWindowText(cardset.getCardById(cardId).getDescription(), 2);
        super.setTextWindowText(cardset.getCardById(cardId).getDetails(), 3);
    }

    #onSelectHandCardsetCard(cardIds: string[]): void {
        const cardset = super.getCardset();
        cardset.highlightCardsByIndexes(cardIds);
        super.createCommandWindowBottom('Put in field?', [
            {
                description: 'Yes',
                onSelect: () => {
                    super.closeAllWindows();
                    super.closeBoard();
                    super.closeCardset({
                        onComplete: async () => {
                            await this.cardBattle.setBattleCards(this.scene.room.playerId, cardIds);
                            if (await this.cardBattle.isOpponentBattleCardsSet(this.scene.room.playerId)) {
                                this.#createGameBoard();
                                return;
                            }
                            super.createWaitingWindow('Waiting for opponent to set battle cards...');
                            super.openAllWindows({
                                onComplete: async () => {
                                    await this.cardBattle.listenOpponentBattleCardsSet(this.scene.room.playerId, async () => {
                                        super.closeAllWindows({ onComplete: () => this.#createGameBoard() });
                                    });
                                }
                            });
                        }
                    });

                }
            },
            {
                description: 'No',
                onSelect: () => cardset.restoreSelectMode()
            },
        ]);
        super.openCommandWindow();
    }

    async #createGameBoard(): Promise<void> {
        super.createGameBoard({
            isShowBattlePoints: false,
            onComplete: () => {
                super.openGameBoard({
                    isOpponentCardsetOpen: false,
                    onComplete: () => {
                        super.flipOpponentCardset({ onComplete: () => this.#loadBattlePoints() });
                    }
                });
            }
        });
    }

    async #loadBattlePoints(): Promise<void> {
        const battlePoints = await this.cardBattle.getBattlePointsFromBoard(this.scene.room.playerId);
        const opponentBattlePoints = await this.cardBattle.getOpponentBattlePointsFromBoard(this.scene.room.playerId);
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => super.setBattlePointsWithDuration({ ...t, ...battlePoints }),
                (t?: TweenConfig) => super.setOpponentBoardBattlePointsWithDuration({ ...t, ...opponentBattlePoints }),
            ],
            onAllComplete: () => this.#addOnCompleteListener(),
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
            this.closeGameBoard({
                onComplete: () => this.changeToCompilePhase(),
            });
        };
        keyboard.once('keydown-ENTER', onKeyDown, this);
    }

    changeToCompilePhase(): void {
        this.scene.changePhase(new CompilePhase(this.scene));
    }
}