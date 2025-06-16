import { Phase } from "./Phase";
import { CardBattleScene } from '../CardBattleScene';
import { TextWindow } from '@ui/TextWindow';
import { StartPhase } from "./StartPhase";

export class ChallengePhase implements Phase {
    private window: TextWindow;
    constructor(readonly scene: CardBattleScene) {}

    create(): void {
        this.window = TextWindow.createCenteredWindow(this.scene, 'Challenge Phase started! Complete the challenge to proceed.', {
            onClose: () => {
                this.scene.changePhase(new StartPhase(this.scene));
            }
        });
        this.window.open();
    }

    update(): void {
        console.log("Updating Challenge Phase...");
    }

}