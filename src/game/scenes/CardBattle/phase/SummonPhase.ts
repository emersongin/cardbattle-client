import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CardData } from "@/game/objects/CardData";
import { BoardWindowData } from "@/game/objects/BoardWindowData";
import { ColorsPointsData } from "@/game/objects/CardsFolderData";
import { CompilePhase } from "@scenes/CardBattle/phase/CompilePhase";
import { TweenConfig } from "@/game/types/TweenConfig";
import { BLACK, BLUE, GREEN, ORANGE, RED, WHITE } from "@/game/constants/colors";
import { AP, HP } from "@/game/constants/keys";

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
        this.#createHandDisplayWindows();
        this.#openHandCardset({
            [RED]: boardData[RED],
            [GREEN]: boardData[GREEN],
            [BLUE]: boardData[BLUE],
            [BLACK]: boardData[BLACK],
            [WHITE]: boardData[WHITE],
            [ORANGE]: 0
        });
    }

    #createHandDisplayWindows(): void {
        super.createTextWindowTop('Your Hand', {
            textAlign: 'center',
        });
        super.addTextWindow('...', { marginTop: 32 });
        super.addTextWindow('...');
        super.addTextWindow('...');
    }

    #openHandCardset(colorPoints: ColorsPointsData): void {
        const cardset = super.getCardset();
        super.openCardset({
            faceUp: true, 
            onComplete: () => {
                super.openAllWindows();
                super.openBoard();
                cardset.selectModeMany({
                    onChangeIndex: (cardId: string) => this.#onChangeHandCardsetIndex(cardId),
                    onCreditPoint: (cardId: string) => {
                        const card = cardset.getCardById(cardId);
                        const cardColor = card.getColor();
                        const cardCost = card.getCost();
                        super.addBoardColorPoints(cardColor, cardCost);
                    },
                    onDebitPoint: (cardId: string) => {
                        const card = cardset.getCardById(cardId);
                        const cardColor = card.getColor();
                        const cardCost = card.getCost();
                        super.removeBoardColorPoints(cardColor, cardCost);
                    },
                    onComplete: (cardIds: string[]) => this.#onSelectHandCardsetCard(cardIds),
                }, colorPoints);
            }
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
        const boardData: BoardWindowData = await this.cardBattle.getBoard(this.scene.room.playerId);
        const opponentBoard = await this.cardBattle.getOpponentBoard(this.scene.room.playerId);
        const cardsData: CardData[] = await this.cardBattle.getBattleCards(this.scene.room.playerId);
        const opponentCards = await this.cardBattle.getOpponentBattleCards(this.scene.room.playerId);
        await Promise.all([
            super.createBoard({ ...boardData, [AP]: 0, [HP]: 0 }),
            super.createOpponentBoard({ ...opponentBoard, [AP]: 0, [HP]: 0 }),
            super.createCardset(cardsData),
            super.createOpponentCardset(opponentCards)
        ]);
        super.openGameBoard({
            onComplete: () => {
                this.flipOpponentCardSet({
                    onComplete: () => this.#loadBattlePoints()
                });
            }
        })
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
        this.scene.changePhase(new CompilePhase(this.scene));
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    destroy(): void {
        super.destroyAllTextWindows();
    }
}