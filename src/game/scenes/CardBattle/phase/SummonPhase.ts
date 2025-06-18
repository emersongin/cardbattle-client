import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { CompilePhase } from "./CompilePhase";

export class SummonPhase implements Phase {
    #window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

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

    create(): void {
        this.#window = TextWindow.createCenteredWindow(this.scene, 'Summon Phase started!', {
            onClose: () => {
                this.changeToCompilePhase();
            }
        });
        this.#window.open();
    }

    update(): void {
        console.log("Updating Summon Phase...");
    }

    destroy(): void {
        if (this.#window) this.#window.destroy();
    }
}