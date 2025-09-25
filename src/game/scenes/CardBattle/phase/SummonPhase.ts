import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CardData } from "@/game/objects/CardData";
import { BoardWindowData } from "@/game/objects/BoardWindowData";
import { CompilePhase } from "@scenes/CardBattle/phase/CompilePhase";
import { TweenConfig } from "@/game/types/TweenConfig";
import { ORANGE } from "@/game/constants/colors";
import { CardColorsType } from "@/game/types/CardColorsType";
import { Card } from "@/game/ui/Card/Card";
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
        this.#openHandZone();
    }

    #openHandZone(): void {
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.openBoard(config),
                (config?: TweenConfig) => super.openCardset({ ...config, faceUp: true }),
            ],
            onAllComplete: () => {
                super.openAllWindows();
                super.setSelectModeMultCardset({
                    onChangeIndex: (card: Card) => this.#onChangeHandCardsetIndex(card),
                    onHasEnoughColorPointsByColor: (card: Card) => this.#onHasEnoughColorPointsByColor(card),
                    onCreditPoint: (card: Card) => this.#onCreditPoint(card),
                    onDebitPoint: (card: Card) => this.#onDebitPoint(card),
                    onComplete: (cardIds: string[]) => {
                        super.getCardset().highlightCardsByIndexes(cardIds);
                        this.#createCommandWindow(cardIds);
                        super.openCommandWindow();
                    },
                });
            },
        });
    }
    
    #onChangeHandCardsetIndex(card: Card): void {
        super.setTextWindowText(card.getName(), 1);
        super.setTextWindowText(card.getDescription(), 2);
        super.setTextWindowText(card.getDetails(), 3);
    }
    
    #onHasEnoughColorPointsByColor(card: Card): boolean {
        const cardColor = card.getColor();
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return true;
        return super.getBoard().hasEnoughColorPointsByColor(cardColor, cardCost);
    }

    #onCreditPoint(card: Card): void {
        const cardColor = card.getColor() as CardColorsType;
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        if (cardCost > 0) super.getBoard().addColorPoints(cardColor, cardCost);
    }

    #onDebitPoint(card: Card): void {
        const cardColor = card.getColor() as CardColorsType;
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        if (cardCost > 0) super.getBoard().removeColorPoints(cardColor, cardCost);
    }

    #createCommandWindow(cardIds: string[]): void {
        const cardset = super.getCardset();
        super.createCommandWindowBottom('Put in field?', [
            {
                description: 'Yes',
                onSelect: () => this.#onYes(cardIds)
            },
            {
                description: 'No',
                onSelect: () => cardset.restoreSelectMode()
            },
        ]);
    }

    #onYes(cardIds: string[]): void {
        this.scene.timeline({
            targets: [
                (config?: TweenConfig) => super.closeAllWindows(config),
                (config?: TweenConfig) => super.closeBoard(config),
                (config?: TweenConfig) => super.closeCardset(config),
            ],
            onAllComplete: async () => {
                await this.cardBattle.setBattleCards(this.scene.room.playerId, cardIds);
                if (await this.cardBattle.isOpponentBattleCardsSet(this.scene.room.playerId)) {
                    this.#createGameBoard();
                    return;
                }
                super.createWaitingWindow('Waiting for opponent to set battle cards...');
                super.openAllWindows({
                    onComplete: async () => {
                        const ON = async () => {
                            super.closeAllWindows({ onComplete: () => this.#createGameBoard() });
                        };
                        await this.cardBattle.listenOpponentBattleCardsSet(this.scene.room.playerId, ON);
                    }
                });
            },
        });
    }

    async #createGameBoard(): Promise<void> {
        await super.createGameBoard({ isShowBattlePoints: false });
        await super.openGameBoard({ isOpponentCardsetOpen: false });
        super.flipOpponentCardset({ onComplete: () => this.#loadBattlePoints() });
    }

    async #loadBattlePoints(): Promise<void> {
        const battlePoints = await this.cardBattle.getBattlePointsFromBoard(this.scene.room.playerId);
        const opponentBattlePoints = await this.cardBattle.getOpponentBattlePointsFromBoard(this.scene.room.playerId);
        this.scene.timeline({
            targets: [
                (t?: TweenConfig) => super.setBattlePointsWithDuration({ ...t, ...battlePoints }),
                (t?: TweenConfig) => super.setOpponentBoardBattlePointsWithDuration({ ...t, ...opponentBattlePoints }),
            ],
            onAllComplete: () => {
                this.scene.addListerOnKeydownEnterOnce({
                    onComplete: async () => {
                        await super.closeGameBoard();
                        this.changeToCompilePhase();
                    }
                });
            }
        });
    }

    changeToCompilePhase(): void {
        this.scene.changePhase(new CompilePhase(this.scene));
    }
}