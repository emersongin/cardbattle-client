import { Phase } from "@scenes/CardBattle/phase/Phase";
import { ChallengePhase } from "@scenes/CardBattle/phase/ChallengePhase";
import { CardBattlePhase } from './CardBattlePhase';

export class BattlePhase extends CardBattlePhase implements Phase {
    
    create(): void {
        // Create and show the Battle Phase window
    }

    changeToChallengePhase(): void {
        this.scene.changePhase(new ChallengePhase(this.scene));
    }
}