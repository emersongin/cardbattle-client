import { Phase } from "@scenes/CardBattle/phase/Phase";
import { ChallengePhase } from "@scenes/CardBattle/phase/ChallengePhase";
import { CardBattlePhase } from './CardBattlePhase';

export class BattlePhase extends CardBattlePhase implements Phase {
    
    create(): void {
        const onClose = async () => {
            await super.createGameBoard();
            await super.openGameBoard();
            await super.createTextWindowCentered('Card Battle', { 
                textAlign: 'center', 
                onClose: () => {}//super.resumePhase()
            });
            super.openAllWindows();
        }
        super.createTextWindowCentered('Battle Phase', { textAlign: 'center', onClose });
        super.addTextWindow('Start Battle!');
        super.openAllWindows();
    }

    changeToChallengePhase(): void {
        this.scene.changePhase(new ChallengePhase(this.scene));
    }
}