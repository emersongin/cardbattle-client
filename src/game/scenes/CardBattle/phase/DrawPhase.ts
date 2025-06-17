import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { LoadPhase } from "./LoadPhase";

export class DrawPhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Draw Phase started!', {
            onClose: () => {
                this.scene.changePhase(new LoadPhase(this.scene));
            }
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Draw Phase...");
    }
    
    destroy(): void {
        if (this.window) {
            this.window.destroy();
        }
    }
}