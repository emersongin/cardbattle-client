import { VueScene } from '../VueScene';
import { Phase } from './phase/Phase';
import { ChallengePhase } from './phase/ChallengePhase';
import { EventBus } from '@game/EventBus';

export class CardBattleScene extends VueScene {
    private phase: Phase;
    constructor () {
        super('CardBattle');
    }

    init () {
        EventBus.emit('current-scene-ready', this);
    }

    create () {
        this.changePhase(new ChallengePhase(this));
    }

    changePhase(phase: Phase) {
        this.phase = phase;
        this.phase.create();
    }

    update() {
        if (this.phase) this.phase.update();
    }
}
