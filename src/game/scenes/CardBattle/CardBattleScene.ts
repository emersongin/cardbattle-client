import { Scene } from 'phaser';
import { Phase } from './phase/Phase';
import { ChallengePhase } from './phase/ChallengePhase';

export class CardBattleScene extends Scene {
    private phase: Phase;
    constructor () {
        super('CardBattle');
    }

    preload () {
        
    }

    create () {
        this.changePhase(new ChallengePhase(this));
    }

    changePhase(phase: Phase) {
        this.phase = phase;
        this.phase.create();
    }
}
