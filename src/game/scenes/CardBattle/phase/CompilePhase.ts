import { Phase } from "@scenes/CardBattle/phase/Phase";
import { TriggerPhase } from "@scenes/CardBattle/phase/TriggerPhase";
import { PowerPhase } from "./PowerPhase";
import { BattlePhase } from "./BattlePhase";
import { CardData } from "@/game/objects/CardData";

export class CompilePhase extends PowerPhase implements Phase {

    startPhase(): void {
        super.createTextWindowCentered('Compile Phase', {
            textAlign: 'center',
            onClose: async () => {
                await super.createGameBoard();
                super.openGameBoard({
                    onComplete: () => {
                        super.createTextWindowCentered('Begin Compile Phase', { 
                            textAlign: 'center', 
                            onClose: () => super.resumePhase()
                        });
                        super.openAllWindows();
                    }
                });
            }
        });
        super.addTextWindow('Select and use a Power Card');
        super.openAllWindows();
    }

    async createHandZone(): Promise<void> {
        super.createHandDisplayWindows();
        const cards: CardData[] = await this.cardBattle.getCardsFromHandInTheCompilePhase(this.scene.room.playerId);
        super.createHandCardset(cards);
        super.openHandZone();
    }

    changeTo(): void {
        this.changeToBattlePhase();
    }

    changeToTriggerPhase(): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this));
    }

    changeToBattlePhase(): void {
        super.closeBoard({ onComplete: () => this.scene.changePhase(new BattlePhase(this.scene)) });
        super.closeOpponentBoard();
    }

}
