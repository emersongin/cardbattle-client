import { VueScene } from '../VueScene';
import { Phase } from './phase/Phase';
import { EventBus } from '@game/EventBus';
// import { ChallengePhase } from './phase/ChallengePhase';
// import { StartPhase } from './phase/StartPhase';
import { DrawPhase } from './phase/DrawPhase';

export class CardBattleScene extends VueScene {
    private phase: Phase;
    
    constructor () {
        super('CardBattleScene');
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    create () {
        this.changePhase(new DrawPhase(this));
    }

    changePhase(phase: Phase) {
        this.phase = phase;
        this.phase.create();
    }

    update() {
        if (this.phase) this.phase.update();
    }
}
