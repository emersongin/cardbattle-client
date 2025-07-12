import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { LoadPhase } from "./LoadPhase";

export class DrawPhase implements Phase {
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
        this.scene.changePhase(new LoadPhase(this.scene));
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
        this.#window = TextWindow.createCenteredWindow(this.scene, 'Draw Phase started!', {
            onClose: () => {
                this.changeToLoadPhase();
            }
        });
        this.#window.open();
    }

    update(): void {
        console.log("Updating Draw Phase...");
    }
    
    destroy(): void {
        if (this.#window) this.#window.destroy();
    }
}