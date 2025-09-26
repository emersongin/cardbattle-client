import { Phase } from "@scenes/CardBattle/phase/Phase";
import { SummonPhase } from "@scenes/CardBattle/phase/SummonPhase";
import { PowerPhase } from "./PowerPhase";
import { CardData } from "@/game/objects/CardData";

export class LoadPhase extends PowerPhase implements Phase {

    createPhaseWindows(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.openGameBoard();
            await super.createTextWindowCentered('Begin Load Phase', { 
                textAlign: 'center', 
                onClose: () => super.resumePhase()
            });
            super.openAllWindows();
        }
        super.createTextWindowCentered('Load Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Select and use a Power Card');
    }

    async createHandZone(): Promise<void> {
        const cards: CardData[] = await this.cardBattle.getCardsFromHandInTheLoadPhase(this.scene.room.playerId);
        super.createHandCardset(cards);
    }

    changeTo(): void {
        this.changeToSummonPhase();
    }

    changeToSummonPhase(): void {
        this.closeBoard({ onComplete: () => this.scene.changePhase(new SummonPhase(this.scene)) });
        this.closeOpponentBoard();
    }

}
