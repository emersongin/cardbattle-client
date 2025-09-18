import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CardData } from "@/game/objects/CardData";
import { BoardWindowData } from "@/game/objects/BoardWindowData";
import { ColorsPointsData } from "@/game/objects/CardsFolderData";
import { CompilePhase } from "@scenes/CardBattle/phase/CompilePhase";
import { TweenConfig } from "@/game/types/TweenConfig";
import { TimelineConfig, TimelineEvent } from "../../VueScene";
import { CardUi } from "@/game/ui/Card/CardUi";
import { CardActionsBuilder } from "@/game/ui/Card/CardActionsBuilder";

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
            RED: boardData.redPoints,
            GREEN: boardData.greenPoints,
            BLUE: boardData.bluePoints,
            BLACK: boardData.blackPoints,
            WHITE: boardData.whitePoints,
            ORANGE: 0
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
                                this.#showBattleCards();
                                return;
                            }
                            this.#createOpponentBattleCardSetWaitingWindow();
                            super.openAllWindows({
                                onComplete: async () => {
                                    await this.cardBattle.listenOpponentBattleCardsSet(this.scene.room.playerId, async () => {
                                        super.closeAllWindows({ onComplete: () => this.#showBattleCards() });
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

    async #showBattleCards(): Promise<void> {
        const boardData: BoardWindowData = await this.cardBattle.getBoard(this.scene.room.playerId);
        const opponentBoard = await this.cardBattle.getOpponentBoard(this.scene.room.playerId);
        const cardsData: CardData[] = await this.cardBattle.getBattleCards(this.scene.room.playerId);
        const opponentCards = await this.cardBattle.getOpponentBattleCards(this.scene.room.playerId);
        super.createBoard(boardData);
        super.createOpponentBoard(opponentBoard);
        super.createCardset(cardsData);
        super.createOpponentCardset(opponentCards);
        this.openGameBoard()
    }

    openGameBoard(): void {
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => super.openOpponentBoard(t),
                (t?: TweenConfig) => super.openBoard(t),
                (t?: TweenConfig) => super.openCardset({ faceUp: true, ...t }),
                (t?: TweenConfig) => super.openOpponentCardset(t),
            ],
            onAllComplete: () => {
                this.#flipOpponentCardSet();
            },
        });
    }

    #flipOpponentCardSet(): void {
        const flipConfig: TimelineConfig<CardUi> = {
            targets: this.getOpponentCardset().getCardsUi(),
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
                this.#loadBattlePoints();
            }
        };
        this.scene.timeline(flipConfig);
    }

    async #loadBattlePoints(): Promise<void> {
        const battlePoints = await this.cardBattle.getBattlePoints(this.scene.room.playerId);
        const opponentBattlePoints = await this.cardBattle.getOpponentBattlePoints(this.scene.room.playerId);
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => super.setBattlePointsWithDuration({ ...t, ...battlePoints }),
                (t?: TweenConfig) => super.setOpponentBoardBattlePointsWithDuration({ ...t, ...opponentBattlePoints }),
            ],
            onAllComplete: () => {
                console.log('updated battle points');
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

    #createOpponentBattleCardSetWaitingWindow(): void {
        super.createWaitingWindow('Waiting for opponent to set battle cards...');
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