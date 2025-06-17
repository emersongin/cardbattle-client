import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@/game/ui/TextWindow';
import { ChallengePhase } from "./ChallengePhase";

export class BattlePhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Battle Phase started!', {
            onClose: () => {
                this.scene.changePhase(new ChallengePhase(this.scene));
            }
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Battle Phase...");
    }

    destroy(): void {
        if (this.window) {
            this.window.destroy();
        }
    }

}