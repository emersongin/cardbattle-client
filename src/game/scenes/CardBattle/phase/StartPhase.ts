import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';

export class StartPhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        console.log("Start Phase created.");
        this.window = TextWindow.createCenteredWindow(this.scene, 'Challenge Phase completed, transitioning to Start Phase!', () => {
            console.log("nothing");
            this.destroy();
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