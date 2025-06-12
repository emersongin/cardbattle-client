import { Scene } from 'phaser';
import { Phase } from './phase/Phase';
import { ChallengePhase } from './phase/ChallengePhase';

export class CardBattle extends Scene {
    private phase: Phase;
    constructor () {
        super('CardBattle');
        this.phase = new ChallengePhase(this);
    }

    preload () {
        
    }

    create () {
        this.phase.create();
    }
}
