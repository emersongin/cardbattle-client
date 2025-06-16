import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';
import { SummonPhase } from "./SummonPhase";

export class LoadPhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Load Phase started! Complete the mini-game to proceed.', {
            onClose: () => {
                this.scene.changePhase(new SummonPhase(this.scene));
            }
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Load Phase...");
    }
    
}