import { Phase } from "./Phase";
import { LoadPhase } from "./LoadPhase";
import { BoardWindowData, CardData } from "@game/types";
import { CARD_HEIGHT, CARD_WIDTH } from "@game/ui/Card/Card";
import { Cardset } from "@game/ui/Cardset/Cardset";
import BoardWindow from "@game/ui/BoardWindow/BoardWindow";
import { CardUi } from "@game/ui/Card/CardUi";
import { TimelineConfig, TimelineEvent } from "../../VueScene";
import { ORANGE } from "@game/constants/Colors";
import { DECK, HAND } from "@/game/constants/Keys";
import { CardBattlePhase } from "./CardBattlePhase";

export class DrawPhase extends CardBattlePhase implements Phase {
    #playerBoard: BoardWindow;
    #opponentBoard: BoardWindow;
    #playerCardset: Cardset;
    #opponentCardset: Cardset;

    async create(): Promise<void> {
        const playerCards: CardData[] = await this.cardBattle.drawPlayerCardsData();
        const opponentCards: CardData[] = await this.cardBattle.drawOpponentCardsData();
        const playerBoardData: BoardWindowData = await this.cardBattle.getPlayerBoardData();
        const opponentBoardData: BoardWindowData = await this.cardBattle.getOpponentBoardData();
        this.#createDrawPhaseWindows();
        this.#createBoards(playerBoardData, opponentBoardData);
        this.#createCardsets(playerCards, opponentCards);
        this.openAllWindows();
    }

    #createDrawPhaseWindows(): void {
        super.createTextWindowCentered('Draw Phase', {
            textAlign: 'center',
            onClose: () => {
                this.#openBoards();
                this.#moveCardSetsToBoards();
            }
        });
        super.addTextWindow('6 cards will be draw.');
    }

    #createCardsets(playerCards: CardData[], opponentCards: CardData[]): void {
        this.#createPlayerCardset(playerCards);
        this.#createOpponentCardset(opponentCards);
    }

    #createPlayerCardset(playerCards: CardData[]): void {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3)); 
        const y = (this.#playerBoard.y - (this.#playerBoard.height / 2)) - CARD_HEIGHT - 10; 
        const cardset = Cardset.create(this.scene, playerCards, x, y);
        const widthEdge = this.scene.scale.width;
        cardset.setCardsPosition(widthEdge, 0);
        this.#playerCardset = cardset;
    }

    #createOpponentCardset(opponentCards: CardData[]): void {
        const x = (this.scene.cameras.main.centerX - (CARD_WIDTH * 3));
        const y = (this.#opponentBoard.y + (this.#playerBoard.height / 2)) + 10;
        const cardset = Cardset.create(this.scene, opponentCards, x, y);
        const widthEdge = this.scene.scale.width;
        cardset.setCardsPosition(widthEdge, 0);
        this.#opponentCardset = cardset;
    }

    #createBoards(playerBoardData: BoardWindowData, opponentBoardData: BoardWindowData): void {
        this.#createPlayerBoard(playerBoardData);
        this.#createOpponentBoard(opponentBoardData);
    }

    #createPlayerBoard(playerBoardData: BoardWindowData): void {
        const boardWindow = BoardWindow.createBottom(this.scene, playerBoardData);
        this.#playerBoard = boardWindow;
    }

    #createOpponentBoard(opponentBoardData: BoardWindowData): void {
        const boardWindow = BoardWindow.createTopReverse(this.scene, opponentBoardData);
        this.#opponentBoard = boardWindow;
    }



    #openBoards(): void {
        this.#openPlayerBoard();
        this.#openOpponentBoard();
    }

    #openPlayerBoard(): void {
        this.#playerBoard.open();
    }

    #openOpponentBoard(): void {
        this.#opponentBoard.open();
    }

    #moveCardSetsToBoards(): void {
        this.#movePlayerCardSetToBoard();
        this.#moveOpponentCardSetToBoard();
    }

    #movePlayerCardSetToBoard(): void {
        const totalCards = this.#playerCardset.getCardsTotal();
        const moveConfig = {
            targets: this.#playerCardset.getCardsUi(),
            onStart: ({ target: { card }, tween, index }: TimelineEvent<CardUi>) => {
                tween!.pause();
                card.moveFromTo({
                    xTo: 0 + (index! * CARD_WIDTH),
                    yTo: 0,
                    delay: (index! * 100), 
                    duration: (300 / totalCards) * (totalCards - index!),
                    onStart: () => {
                        tween!.resume();
                        this.#playerBoard.addZonePoints(HAND, 1);
                        this.#playerBoard.removeZonePoints(DECK, 1);
                    }
                });
            },
            onAllComplete: () => {
                this.#flipPlayerCardSet();
            }
        };
        this.scene.timeline(moveConfig);
    }

    #flipPlayerCardSet() {
        const flipConfig: TimelineConfig<CardUi> = {
            targets: this.#playerCardset.getCardsUi(),
            onStart: ({ target: { card }, tween, index  }: TimelineEvent<CardUi>) => {
                tween!.pause();
                card.flip({
                    delay: (index! * 200),
                    onComplete: () => {
                        tween!.resume();
                    }
                });
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
            targets: this.#playerCardset.getCardsUi(),
            onStart: ({ target: { card }, tween, index  }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return;
                tween!.pause();
                card.flash({
                    delay: (index! * 100),
                    onStart: () => {
                        this.#playerBoard.addColorPoints(card.getColor(), 1);
                    },
                    onComplete: () => {
                        tween!.resume();
                    }
                });
            },
            onAllComplete: () => {
                this.#addOnCompletedListener();
            }
        };
        this.scene.timeline(flashConfig);
    }

    #addOnCompletedListener() {
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
        this.#playerBoard.close();
        this.#opponentBoard.close();
    }

    #closeCardSets(): void {
        this.#closePlayerCardSet();
        this.#closeOpponentCardSet();
    }

    #closePlayerCardSet(): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.#playerCardset.getCardsUi(),
            onStart: ({ target: { card }, tween, index  }: TimelineEvent<CardUi>) => {
                tween!.pause();
                card.close({
                    delay: (index! * 100),
                    onComplete: () => {
                        tween!.resume();
                    }
                });
            },
            onAllComplete: () => {
                this.changeToLoadPhase();
            }
        };
        this.scene.timeline(closeConfig);
    }

    #closeOpponentCardSet(): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.#opponentCardset.getCardsUi(),
            onStart: ({ target: { card }, tween, index }: TimelineEvent<CardUi>) => {
                tween!.pause();
                card.close({
                    delay: (index! * 100),
                    onComplete: () => {
                        tween!.resume();
                    }
                });
            },
        };
        this.scene.timeline(closeConfig);
    }

    #flashOpponentCardSet(): void {
        const flashConfig: TimelineConfig<CardUi> = {
            targets: this.#opponentCardset.getCardsUi(),
            onStart: ({ target: { card }, tween, index }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return;
                tween!.pause();
                card.flash({
                    delay: (index! * 100),
                    onStart: () => {
                        this.#opponentBoard.addColorPoints(card.getColor(), 1);
                    },
                    onComplete: () => {
                        tween!.resume();
                    }
                });
            }
        };
        this.scene.timeline(flashConfig);
    }

    #moveOpponentCardSetToBoard(): void {
    const totalCards = this.#opponentCardset.getCardsTotal();
        this.scene.timeline({
            targets: this.#opponentCardset.getCardsUi(),
            x: 0,
            eachX: CARD_WIDTH,
            onStart: ({ target: { card }, tween, index }: TimelineEvent<CardUi>) => {
                tween!.pause();
                card.moveFromTo({
                    xFrom: card.getX(),
                    yFrom: card.getY(),
                    xTo: 0 + (index! * CARD_WIDTH),
                    yTo: 0,
                    delay: (index! * 100), 
                    duration: (300 / totalCards) * (totalCards - index!),
                    onStart: () => {
                        tween!.resume();
                        this.#opponentBoard.addZonePoints(HAND, 1);
                        this.#opponentBoard.removeZonePoints(DECK, 1);
                    }
                });
            },
        });
    }

    update(): void {
        // No specific update logic for DrawPhase
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
        this.destroyAllTextWindows();
        if (this.#playerBoard) this.#playerBoard.destroy();
        if (this.#opponentBoard) this.#opponentBoard.destroy();
        if (this.#playerCardset) this.#playerCardset.destroy();
        if (this.#opponentCardset) this.#opponentCardset.destroy();
    }
}