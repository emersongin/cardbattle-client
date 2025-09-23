import { Phase } from "@scenes/CardBattle/phase/Phase";
import { SummonPhase } from "@scenes/CardBattle/phase/SummonPhase";
import { TriggerPhase } from "@scenes/CardBattle/phase/TriggerPhase";
import { PowerPhase } from "./PowerPhase";

export class LoadPhase extends PowerPhase implements Phase {

    startPhase(): void {
        super.createTextWindowCentered('Load Phase', {
            textAlign: 'center',
            onClose: () => 
                super.openGameBoard({
                    onComplete: () => {
                        super.createTextWindowCentered('Begin Load Phase', { 
                            textAlign: 'center', 
                            onClose: () => super.resumePhase()
                        });
                        super.openAllWindows();
                    }
                })
        });
        super.addTextWindow('Select and use a Power Card');
        super.openAllWindows();
    }

    changeTo(): void {
        this.changeToSummonPhase();
    }

    changeToTriggerPhase(): void {
        this.scene.changePhase(new TriggerPhase(this.scene, this));
    }

    changeToSummonPhase(): void {
        this.closeBoard({ onComplete: () => this.scene.changePhase(new SummonPhase(this.scene)) });
        this.closeOpponentBoard();
    }

}
