import { Phase } from "@scenes/CardBattle/phase/Phase";
import { PowerPhase } from "./PowerPhase";
import { BattlePhase } from "./BattlePhase";
import { CardData } from "@/game/objects/CardData";

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
        const cards: CardData[] = await this.cardBattle.getCardsFromHandInTheCompilePhase(this.scene.room.playerId);
        super.createHandCardset(cards);
    }

    changeTo(): void {
        this.changeToBattlePhase();
    }

    changeToBattlePhase(): void {
        super.closeBoard({ onComplete: () => this.scene.changePhase(new BattlePhase(this.scene)) });
        super.closeOpponentBoard();
    }

}
