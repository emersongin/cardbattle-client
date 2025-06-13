import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';
import { BattlePhase } from "./BattlePhase";

export class CompilePhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Compile Phase started! Complete the mini-game to proceed.', () => {
            this.scene.changePhase(new BattlePhase(this.scene));
            this.destroy();
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Compile Phase...");
    }
    
    destroy(): void {
        this.window?.destroy();
    }
    
}