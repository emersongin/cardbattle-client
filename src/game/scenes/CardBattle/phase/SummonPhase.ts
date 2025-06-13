import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';
import { CompilePhase } from "./CompilePhase";

export class SummonPhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Summon Phase started! Complete the mini-game to proceed.', () => {
            this.scene.changePhase(new CompilePhase(this.scene));
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Summon Phase...");
    }
    
    destroy(): void {
        this.window?.destroy();
    }
    
}