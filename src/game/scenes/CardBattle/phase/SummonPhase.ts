import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CompilePhase } from "@scenes/CardBattle/phase/CompilePhase";
import { TweenConfig } from "@/game/types/TweenConfig";
import { ORANGE } from "@/game/constants/colors";
import { Card } from "@/game/ui/Card/Card";
import { CardColorType } from "@/game/types/CardColorType";
import { BattleCard } from "@/game/ui/Card/BattleCard";
import { PowerCard } from "@/game/ui/Card/PowerCard";
import { BoardWindow } from "@/game/ui/BoardWindow/BoardWindow";
export class SummonPhase extends CardBattlePhase implements Phase {

    create(): void {
        super.createTextWindowCentered('Summon Phase', {
            textAlign: 'center',
            onClose: async () => {
                await this.#createHandZone();
                this.#openHandZone();
            }
        });
        super.addTextWindow('Select and summon battle cards to the field.');
        super.openAllWindows();
    }

    async #createHandZone(): Promise<void> {
        const board: BoardWindow = await this.cardBattle.getBoard(this.scene.room.playerId);
        super.addBoard(board);
        const cards: Card[] = await this.cardBattle.getCardsFromHand(this.scene.room.playerId);
        const battleCards = cards.filter(card => card instanceof BattleCard);
        battleCards.forEach(card => {
            card.faceUp();
            if (!this.#onHasEnoughColorPointsByColor(card.getColor(), card.getCost())) {
                card.disable();
            }
        });
        const powerCards = cards.filter(card => card instanceof PowerCard);
        powerCards.forEach(card => {
            card.faceUp();
            card.disable();
        });
        super.createHandCardset([...battleCards, ...powerCards]);
        super.createHandDisplayWindows();
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
                    onHasEnoughColorPointsByColor: (card: BattleCard) => {
                        return this.#onHasEnoughColorPointsByColor(card.getColor(), card.getCost());
                    },
                    onCreditPoint: (card: BattleCard) => this.#onCreditPoint(card),
                    onDebitPoint: (card: BattleCard) => this.#onDebitPoint(card),
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
        if (card instanceof PowerCard) {
            super.setTextWindowText(card.getEffectDescription(), 3);
            return;
        }
        super.setTextWindowText('...', 3);
    }
    
    #onHasEnoughColorPointsByColor(cardColor: CardColorType, cardCost: number): boolean {
        if (cardColor === ORANGE) return true;
        return super.getBoard().hasEnoughColorPointsByColor(cardColor, cardCost);
    }

    #onCreditPoint(card: BattleCard): void {
        const cardColor = card.getColor() as CardColorType;
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        if (cardCost > 0) super.getBoard().addColorPoints(cardColor, cardCost);
    }

    #onDebitPoint(card: BattleCard): void {
        const cardColor = card.getColor() as CardColorType;
        const cardCost = card.getCost();
        if (cardColor === ORANGE) return;
        if (cardCost > 0) super.getBoard().removeColorPoints(cardColor, cardCost);
    }

    #createCommandWindow(cardIds: string[]): void {
        const cardset = super.getCardset();
        super.createCommandWindowBottom('Put in field?', [
            {
                description: 'Yes',
                onSelect: () => this.#onYes(cardIds),
                disabled: false
            },
            {
                description: 'No',
                onSelect: () => cardset.restoreSelectMode(),
                disabled: false
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
        await super.createGameBoard({ isShowBattlePoints: false, isOpponentBattleCardsFaceDown: true });
        await super.openGameBoard();
        super.flipOpponentCardset({ 
            onComplete: () => this.#loadBattlePoints() 
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
            onAllComplete: () => {
                this.scene.addKeyEnterListeningOnce({
                    onTrigger: async () => {
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