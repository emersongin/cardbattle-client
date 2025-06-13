import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';
import { ChallengePhase } from "./ChallengePhase";

export class BattlePhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Battle Phase started! Complete the mini-game to proceed.', () => {
            this.scene.changePhase(new ChallengePhase(this.scene));
            this.destroy();
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Battle Phase...");
    }
    
    destroy(): void {
        this.window?.destroy();
    }
    
}