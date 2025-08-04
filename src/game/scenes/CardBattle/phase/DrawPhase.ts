import { Phase } from "./Phase";
import { CardBattlePhase } from "./CardBattlePhase";
import { LoadPhase } from "./LoadPhase";
import { CardUi } from "@game/ui/Card/CardUi";
import { TimelineConfig, TimelineEvent } from "../../VueScene";
import { ORANGE } from "@/game/constants/colors";
import { DECK, HAND } from "@/game/constants/keys";
import { CardData } from "@/game/types";
import { CARD_WIDTH } from "@/game/constants/default";

export class DrawPhase extends CardBattlePhase implements Phase {

    async create(): Promise<void> {
        await super.createPlayerBoard();
        await super.createOpponentBoard();
        const playerCards: CardData[] = await this.cardBattle.drawPlayerCardsData();
        const opponentCards: CardData[] = await this.cardBattle.drawOpponentCardsData();
        this.#createPlayerDrawCardset(playerCards);
        this.#createOpponentDrawCardset(opponentCards);
        this.#createDrawPhaseWindows();
        super.openAllWindows();
    }

    #createPlayerDrawCardset(playerCards: CardData[]) {
        const cardset = super.createPlayerCardset(playerCards);
        const widthEdge = this.scene.scale.width;
        cardset.setCardsInLinePosition(widthEdge, 0);
    }

    #createOpponentDrawCardset(opponentCards: CardData[]) {
        const cardset = super.createOpponentCardset(opponentCards);
        const widthEdge = this.scene.scale.width;
        cardset.setCardsInLinePosition(widthEdge, 0);
    }

    #createDrawPhaseWindows(): void {
        super.createTextWindowCentered('Draw Phase', {
            textAlign: 'center',
            onClose: () => {
                super.openPlayerBoard();
                super.openOpponentBoard();
                this.#moveCardSetsToBoards();
            }
        });
        super.addTextWindow('6 cards will be draw.');
    }

    #moveCardSetsToBoards(): void {
        this.#movePlayerCardSetToBoard();
        this.#moveOpponentCardSetToBoard();
    }

    #movePlayerCardSetToBoard(): void {
        const totalCards = this.getPlayerCardset().getCardsTotal();
        const moveConfig = {
            targets: this.getPlayerCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                card.moveFromTo({
                    xTo: (index! * CARD_WIDTH),
                    yTo: 0,
                    delay: (index! * 100), 
                    duration: (300 / totalCards) * (totalCards - index!),
                    onStart: () => {
                        this.addPlayerBoardZonePoints(HAND, 1);
                        this.removePlayerBoardZonePoints(DECK, 1);
                    },
                    onComplete: () => resume()
                });
            },
            onAllComplete: () => this.#flipPlayerCardSet()
        };
        this.scene.timeline(moveConfig);
    }

    #flipPlayerCardSet() {
        const flipConfig: TimelineConfig<CardUi> = {
            targets: this.getPlayerCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                card.flip({
                    delay: (index! * 200),
                    onComplete: () => resume()
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
            targets: this.getPlayerCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return;
                pause();
                card.flash({
                    delay: (index! * 100),
                    onStart: () => this.addPlayerBoardColorPoints(card.getColor(), 1),
                    onComplete: () => resume()
                });
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
        this.closePlayerBoard();
        this.closeOpponentBoard();
    }

    #closeCardSets(): void {
        this.#closePlayerCardSet();
        this.#closeOpponentCardSet();
    }

    #closePlayerCardSet(): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.getPlayerCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                card.close({
                    delay: (index! * 100),
                    onComplete: () => resume()
                });
            },
            onAllComplete: () => this.changeToLoadPhase()
        };
        this.scene.timeline(closeConfig);
    }

    #closeOpponentCardSet(): void {
        const closeConfig: TimelineConfig<CardUi> = {
            targets: this.getOpponentCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                pause();
                card.close({
                    delay: (index! * 100),
                    onComplete: () => resume()
                });
            },
        };
        this.scene.timeline(closeConfig);
    }

    #flashOpponentCardSet(): void {
        const flashConfig: TimelineConfig<CardUi> = {
            targets: this.getOpponentCardset().getCardsUi(),
            onStart: ({ target: { card }, index, pause, resume }: TimelineEvent<CardUi>) => {
                const cardColor = card.getColor();
                if (cardColor === ORANGE) return;
                pause();
                card.flash({
                    delay: (index! * 100),
                    onStart: () => this.addOpponentBoardColorPoints(card.getColor(), 1),
                    onComplete: () => resume()
                });
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
                card.moveFromTo({
                    xFrom: card.getX(),
                    yFrom: card.getY(),
                    xTo: 0 + (index! * CARD_WIDTH),
                    yTo: 0,
                    delay: (index! * 100), 
                    duration: (300 / totalCards) * (totalCards - index!),
                    onStart: () => {
                        this.addOpponentBoardZonePoints(HAND, 1);
                        this.removeOpponentBoardZonePoints(DECK, 1);
                    },
                    onComplete: () => resume()
                });
            },
        };
        this.scene.timeline(moveConfig);
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
        super.destroyAllTextWindows();
        super.destroyPlayerBoard();
        super.destroyOpponentBoard();
        this.destroyPlayerCardset();
        this.destroyOpponentCardset();
    }
}