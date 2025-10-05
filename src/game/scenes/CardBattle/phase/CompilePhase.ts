import { Phase } from "@scenes/CardBattle/phase/Phase";
import { PowerPhase } from "./PowerPhase";
import { BattlePhase } from "./BattlePhase";
import { Card } from "@game/ui/Card/Card";
import { PowerCard } from "@game/ui/Card/PowerCard";
import { BattleCard } from "@game/ui/Card/BattleCard";

export class CompilePhase extends PowerPhase implements Phase {

    createPhaseWindows(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.openGameBoard();
            await super.createTextWindowCentered('Begin Compile Phase', { 
                textAlign: 'center', 
                onClose: () => super.resumePhase()
            });
            super.openAllWindows();
        }
        super.createTextWindowCentered('Compile Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Select and use a Power Card');
    }

    async createHandZone(): Promise<void> {
        const cards: Card[] = await this.cardBattle.getCardsFromHand(this.scene.room.playerId);
        const battleCards = cards.filter(card => card instanceof BattleCard);
        battleCards.forEach(card => {
            card.faceUp();
            card.disable();
        });
        const powerCards = cards.filter(card => card instanceof PowerCard);
        powerCards.forEach(card => {
            card.faceUp();
            card.enable();
        });
        super.createHandCardset([...powerCards, ...battleCards]);
    }

    changeTo(): void {
        this.changeToBattlePhase();
    }

    changeToBattlePhase(): void {
        super.closeBoard({ onComplete: () => this.scene.changePhase(new BattlePhase(this.scene)) });
        super.closeOpponentBoard();
    }

}
