import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow/TextWindow';
import { ChallengePhase } from "./ChallengePhase";

export class BattlePhase implements Phase {
    #window: TextWindow;
    
    constructor(readonly scene: CardBattleScene) {}

    changeToChallengePhase(): void {
        this.scene.changePhase(new ChallengePhase(this.scene));
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
        throw new Error("Method not implemented.");
    }

    changeToBattlePhase(): void {
        throw new Error("Method not implemented.");
    }

    create(): void {
        this.#window = TextWindow.createCentered(this.scene, 'Battle Phase started!', {
            onClose: () => {
                this.changeToChallengePhase();
            }
        });
        this.#window.open();
    }

    update(): void {
        console.log("Updating Battle Phase...");
    }

    destroy(): void {
        if (this.#window) this.#window.destroy();
    }

}