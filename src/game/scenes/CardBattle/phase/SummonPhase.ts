import { Phase } from "./Phase";
import { TextWindow } from '@/game/ui/TextWindow/TextWindow';
import { CompilePhase } from "./CompilePhase";
import { CardBattlePhase } from "./CardBattlePhase";

export class SummonPhase extends CardBattlePhase implements Phase {
    #window: TextWindow;

    create(): void {
        super.createTextWindowCentered('Summon Phase started!', {
            textAlign: 'center',
            onClose: () => {
                this.changeToCompilePhase();
            }
        });
        super.openAllWindows();
    }

    update(): void {
        console.log("Updating Summon Phase...");
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
        this.scene.changePhase(new CompilePhase(this.scene));
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    destroy(): void {
        if (this.#window) this.#window.destroy();
    }
}