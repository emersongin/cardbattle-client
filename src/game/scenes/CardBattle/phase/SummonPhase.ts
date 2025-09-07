import { Phase } from "@scenes/CardBattle/phase/Phase";
import { CardBattlePhase } from "@scenes/CardBattle/phase/CardBattlePhase";
import { CardData } from "@/game/objects/CardData";
import { BoardWindowData } from "@/game/objects/BoardWindowData";
import { ColorsPointsData } from "@/game/objects/CardsFolderData";

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
            WHITE: boardData.whitePoints
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

    #openHandCardset(colorPoints: Partial<ColorsPointsData>): void {
        const cardset = super.getCardset();
        super.openCardset({ 
            faceUp: true, 
            onComplete: () => {
                super.openAllWindows();
                super.openBoard();
                cardset.selectModeMany({
                    onChangeIndex: (cardId: string) => this.#onChangeHandCardsetIndex(cardId),
                    onMarked: (cardId: string) => console.log('Marked card in hand cardset:', cardId),
                    onLeave: () => console.log('Leave hand cardset selection mode'),
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
                onSelect: () => console.log('Summon cards to the field:', cardIds)
            },
            {
                description: 'No',
                onSelect: () => cardset.restoreSelectMode()
            },
        ]);
        super.openCommandWindow();
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
        // this.scene.changePhase(new CompilePhase(this.scene));
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    destroy(): void {
        super.destroyAllTextWindows();
    }
}