import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';
import { DrawPhase } from "./DrawPhase";

export class StartPhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Start Phase completed, transitioning to Start Phase!', () => {
            this.scene.changePhase(new DrawPhase(this.scene));
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Start Phase...");
    }
    
    destroy(): void {
        this.window?.destroy();
    }
    
}